const JournalEntry = require("../models/JournalEntry");

// ---- helpers -------------------------------------------------

/** Turn a JS Date into a "YYYY-MM-DD" key in local time. */
function toDateKey(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateKey, delta) {
  const d = new Date(dateKey + "T00:00:00");
  d.setDate(d.getDate() + delta);
  return toDateKey(d);
}

const getUserId = (req) => req.query.userId || req.body.userId || process.env.DEFAULT_USER_ID || "demo-user";

// ---- controllers ----------------------------------------------

/**
 * POST /api/journal
 * Create or update *today's* entry (mood + tags + text).
 * Upsert so hitting "Add" again the same day edits today's entry
 * instead of creating duplicates.
 */
async function upsertTodayEntry(req, res) {
  try {
    const userId = getUserId(req);
    const { mood, text, tags } = req.body;

    if (!mood || mood < 1 || mood > 5) {
      return res.status(400).json({ message: "mood is required and must be between 1 and 5" });
    }

    const dateKey = toDateKey();

    const entry = await JournalEntry.findOneAndUpdate(
      { userId, dateKey },
      {
        userId,
        dateKey,
        mood,
        text: text || "",
        tags: Array.isArray(tags) ? tags : [],
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json(entry);
  } catch (err) {
    console.error("upsertTodayEntry error:", err);
    return res.status(500).json({ message: "Failed to save journal entry" });
  }
}

/** GET /api/journal/today - fetch today's entry if it exists. */
async function getTodayEntry(req, res) {
  try {
    const userId = getUserId(req);
    const dateKey = toDateKey();
    const entry = await JournalEntry.findOne({ userId, dateKey });
    return res.status(200).json(entry || null);
  } catch (err) {
    console.error("getTodayEntry error:", err);
    return res.status(500).json({ message: "Failed to fetch today's entry" });
  }
}

/**
 * GET /api/journal/history?limit=10
 * Past entries (not including today), most recent first.
 * Powers the "Yesterday Journal / Last day Journal / ..." list.
 */
async function getHistory(req, res) {
  try {
    const userId = getUserId(req);
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const todayKey = toDateKey();

    const entries = await JournalEntry.find({
      userId,
      dateKey: { $lt: todayKey },
    })
      .sort({ dateKey: -1 })
      .limit(limit);

    return res.status(200).json(entries);
  } catch (err) {
    console.error("getHistory error:", err);
    return res.status(500).json({ message: "Failed to fetch journal history" });
  }
}

/**
 * GET /api/journal/streak
 * Returns current streak count + this month's calendar with which
 * days have an entry, for the "Calendar / Streak" side panel.
 */
async function getStreak(req, res) {
  try {
    const userId = getUserId(req);
    const todayKey = toDateKey();

    // Pull every dateKey the user has ever logged, newest first.
    const entries = await JournalEntry.find({ userId }).sort({ dateKey: -1 }).select("dateKey -_id");
    const loggedDays = new Set(entries.map((e) => e.dateKey));

    // Consecutive-day streak counting backwards from today.
    // If today isn't logged yet, still count the streak ending yesterday
    // so the user doesn't lose their streak display before they check in.
    let streak = 0;
    let cursor = loggedDays.has(todayKey) ? todayKey : addDays(todayKey, -1);
    while (loggedDays.has(cursor)) {
      streak += 1;
      cursor = addDays(cursor, -1);
    }

    // Build this month's calendar: day number -> logged boolean.
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      calendar.push({ day, logged: loggedDays.has(key), isToday: key === todayKey });
    }

    return res.status(200).json({ streak, calendar, totalEntries: loggedDays.size });
  } catch (err) {
    console.error("getStreak error:", err);
    return res.status(500).json({ message: "Failed to compute streak" });
  }
}

module.exports = {
  upsertTodayEntry,
  getTodayEntry,
  getHistory,
  getStreak,
};

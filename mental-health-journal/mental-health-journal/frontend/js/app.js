/**
 * MindLog frontend logic.
 * Talks to the backend only through JournalAPI (see api.js).
 */

const MOOD_EMOJI = { 1: "😄", 2: "🙂", 3: "😐", 4: "🙁", 5: "😞" };

let selectedMood = null;

const moodScaleEl = document.getElementById("moodScale");
const checkinPromptEl = document.getElementById("checkinPrompt");
const journalTextEl = document.getElementById("journalText");
const addBtn = document.getElementById("addEntryBtn");
const saveStatusEl = document.getElementById("saveStatus");
const historyListEl = document.getElementById("historyList");
const streakCountEl = document.getElementById("streakCount");
const calendarGridEl = document.getElementById("calendarGrid");

// ---------- Mood selector ----------

moodScaleEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".mood-face");
  if (!btn) return;

  selectedMood = Number(btn.dataset.mood);

  document.querySelectorAll(".mood-face").forEach((el) => el.classList.remove("selected"));
  btn.classList.add("selected");
});

// ---------- Sidebar nav (visual only for step 1) ----------

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    if (item.classList.contains("nav-logout")) return; // wire up real logout later
    document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
    item.classList.add("active");
  });
});

// ---------- Save entry ----------

addBtn.addEventListener("click", async () => {
  if (!selectedMood) {
    showStatus("Pick a mood before saving.", true);
    return;
  }

  addBtn.disabled = true;
  showStatus("Saving…");

  const promptWord = checkinPromptEl.value.trim();
  const bodyText = journalTextEl.value.trim();
  const combinedText = [promptWord, bodyText].filter(Boolean).join("\n\n");

  try {
    await JournalAPI.saveTodayEntry({
      mood: selectedMood,
      text: combinedText,
      tags: [],
    });
    showStatus("Saved to today's journal ✓");
    await Promise.all([loadStreak(), loadHistory()]);
  } catch (err) {
    console.error(err);
    showStatus(err.message || "Something went wrong.", true);
  } finally {
    addBtn.disabled = false;
  }
});

function showStatus(msg, isError = false) {
  saveStatusEl.textContent = msg;
  saveStatusEl.classList.toggle("error", isError);
}

// ---------- Load today's entry (so a refresh doesn't lose your check-in) ----------

async function loadToday() {
  try {
    const entry = await JournalAPI.getTodayEntry();
    if (!entry) return;

    selectedMood = entry.mood;
    const btn = document.querySelector(`.mood-face[data-mood="${entry.mood}"]`);
    if (btn) btn.classList.add("selected");

    journalTextEl.value = entry.text || "";
    showStatus("Today's entry loaded.");
  } catch (err) {
    console.error("loadToday failed:", err);
  }
}

// ---------- History list ----------

function formatRelativeDate(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const entryDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - entryDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "Yesterday";
  if (diffDays === 2) return "2 days ago";
  if (diffDays <= 6) return `${diffDays} days ago`;

  return entryDate.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

async function loadHistory() {
  try {
    const entries = await JournalAPI.getHistory(10);

    if (!entries.length) {
      historyListEl.innerHTML = `<p class="history-empty">No past entries yet — your journal history will show up here.</p>`;
      return;
    }

    historyListEl.innerHTML = entries
      .map(
        (entry) => `
        <div class="history-entry">
          <span class="history-mood">${MOOD_EMOJI[entry.mood] || "😐"}</span>
          <div class="history-body">
            <div class="history-date">${formatRelativeDate(entry.dateKey)} Journal</div>
            <div class="history-text">${escapeHtml(entry.text) || "<em>No note added.</em>"}</div>
          </div>
        </div>`
      )
      .join("");
  } catch (err) {
    console.error("loadHistory failed:", err);
    historyListEl.innerHTML = `<p class="history-empty">Couldn't load history — is the backend running?</p>`;
  }
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ---------- Calendar / streak panel ----------

async function loadStreak() {
  try {
    const { streak, calendar } = await JournalAPI.getStreak();
    streakCountEl.textContent = streak;

    calendarGridEl.innerHTML = calendar
      .map((d) => {
        const classes = ["cal-day"];
        if (d.logged) classes.push("logged");
        if (d.isToday) classes.push("today");
        return `<div class="${classes.join(" ")}">${d.day}</div>`;
      })
      .join("");
  } catch (err) {
    console.error("loadStreak failed:", err);
    calendarGridEl.innerHTML = `<p class="history-empty">Couldn't load calendar.</p>`;
  }
}

// ---------- Init ----------

(async function init() {
  await Promise.all([loadToday(), loadHistory(), loadStreak()]);
  saveStatusEl.textContent = "";
})();

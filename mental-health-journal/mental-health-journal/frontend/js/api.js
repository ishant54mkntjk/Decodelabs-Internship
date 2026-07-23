/**
 * Thin wrapper around fetch() for the journal API.
 * Kept separate from app.js so app.js only deals with UI logic.
 */

const API_BASE = "/api/journal";

// Step 1 has no login yet, so we use a stable local id as "the user".
// Once auth is added in a later step, this gets replaced by the real user id.
function getUserId() {
  let id = localStorage.getItem("mindlog_user_id");
  if (!id) {
    id = "demo-user";
    localStorage.setItem("mindlog_user_id", id);
  }
  return id;
}

const JournalAPI = {
  async saveTodayEntry({ mood, text, tags }) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUserId(), mood, text, tags }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.message || "Failed to save entry");
    }
    return res.json();
  },

  async getTodayEntry() {
    const res = await fetch(`${API_BASE}/today?userId=${getUserId()}`);
    if (!res.ok) throw new Error("Failed to load today's entry");
    return res.json();
  },

  async getHistory(limit = 10) {
    const res = await fetch(`${API_BASE}/history?userId=${getUserId()}&limit=${limit}`);
    if (!res.ok) throw new Error("Failed to load history");
    return res.json();
  },

  async getStreak() {
    const res = await fetch(`${API_BASE}/streak?userId=${getUserId()}`);
    if (!res.ok) throw new Error("Failed to load streak");
    return res.json();
  },
};

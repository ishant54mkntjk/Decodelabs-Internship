const express = require("express");
const router = express.Router();
const {
  upsertTodayEntry,
  getTodayEntry,
  getHistory,
  getStreak,
} = require("../controllers/journalController");

// POST   /api/journal            -> save/update today's mood + journal text
// GET    /api/journal/today      -> today's entry (or null)
// GET    /api/journal/history    -> past entries (Yesterday, Last day, ...)
// GET    /api/journal/streak     -> streak count + calendar grid for this month

router.post("/", upsertTodayEntry);
router.get("/today", getTodayEntry);
router.get("/history", getHistory);
router.get("/streak", getStreak);

module.exports = router;

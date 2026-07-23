const mongoose = require("mongoose");

/**
 * One document = one day's check-in for one user.
 * "dateKey" is the day normalized to YYYY-MM-DD so we can enforce
 * "one entry per user per day" and make calendar/streak queries cheap.
 */
const journalEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    dateKey: {
      // e.g. "2026-07-17"
      type: String,
      required: true,
      index: true,
    },
    mood: {
      // 1 = great ... 5 = awful, matches the 5 emoji faces in the UI
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      default: "",
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
    },
    sentiment: {
      score: { type: Number, default: null }, // -1..1, filled in by sentiment engine (step 2)
      label: { type: String, default: null }, // "positive" | "neutral" | "negative"
    },
  },
  { timestamps: true }
);

// A user can only have one journal entry per calendar day
journalEntrySchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("JournalEntry", journalEntrySchema);

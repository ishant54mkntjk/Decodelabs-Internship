const mongoose = require("mongoose");

/**
 * Minimal User model.
 * Step 1 does not implement auth/login yet - every journal entry is
 * tagged with a userId string (see DEFAULT_USER_ID in .env).
 * This schema exists so the Profile/Settings pages have something to
 * attach to once login is built in a later step.
 */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Guest" },
    email: { type: String, unique: true, sparse: true },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

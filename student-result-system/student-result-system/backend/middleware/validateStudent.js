const store = require("../models/studentStore");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// isUpdate = true relaxes "required" checks so PATCH-like partial
// updates could be supported later; for this assignment PUT still
// sends the full object, so we validate all fields either way.
function validateStudent(req, res, next) {
  const { name, email, course, marks } = req.body;
  const errors = [];

  if (typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and cannot be empty.");
  }

  if (typeof course !== "string" || course.trim().length === 0) {
    errors.push("Course is required and cannot be empty.");
  }

  if (typeof email !== "string" || email.trim().length === 0) {
    errors.push("Email is required.");
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.push("Email must be a valid email address.");
  }

  const marksNum = Number(marks);
  if (marks === undefined || marks === null || marks === "" || Number.isNaN(marksNum)) {
    errors.push("Marks is required and must be a number.");
  } else if (marksNum < 0 || marksNum > 100) {
    errors.push("Marks must be between 0 and 100.");
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  // Uniqueness check on email (excluding current record when editing)
  const excludeId = req.params.id ? Number(req.params.id) : null;
  const existing = store.findByEmail(email.trim(), excludeId);
  if (existing) {
    return res
      .status(409)
      .json({ success: false, errors: ["A student with this email already exists."] });
  }

  req.body.name = name.trim();
  req.body.email = email.trim();
  req.body.course = course.trim();
  req.body.marks = marksNum;

  next();
}

module.exports = validateStudent;

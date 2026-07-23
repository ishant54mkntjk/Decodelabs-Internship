const express = require("express");
const router = express.Router();
const store = require("../models/studentStore");
const validateStudent = require("../middleware/validateStudent");

// GET /students/search?name=  -- must be declared before /:id
router.get("/search", (req, res) => {
  const { name } = req.query;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: "Search query 'name' cannot be empty." });
  }

  const results = store.searchByName(name.trim());
  res.status(200).json({ success: true, data: results });
});

// GET /students
router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: store.getAll() });
});

// GET /students/:id
router.get("/:id", (req, res) => {
  const student = store.getById(Number(req.params.id));
  if (!student) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  res.status(200).json({ success: true, data: student });
});

// POST /students
router.post("/", validateStudent, (req, res) => {
  const student = store.create(req.body);
  res.status(201).json({ success: true, data: student });
});

// PUT /students/:id
router.put("/:id", validateStudent, (req, res) => {
  const id = Number(req.params.id);
  const existing = store.getById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  const updated = store.update(id, req.body);
  res.status(200).json({ success: true, data: updated });
});

// DELETE /students/:id
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const existing = store.getById(id);
  if (!existing) {
    return res.status(404).json({ success: false, message: "Student not found." });
  }
  store.remove(id);
  res.status(200).json({ success: true, message: "Student deleted successfully." });
});

module.exports = router;

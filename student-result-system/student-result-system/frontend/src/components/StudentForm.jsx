import { useState, useEffect } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = { name: "", email: "", course: "", marks: "" };

export default function StudentForm({ student, onCancel, onSubmit, submitError }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        course: student.course,
        marks: String(student.marks),
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [student]);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.course.trim()) next.course = "Course is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    const marksNum = Number(form.marks);
    if (form.marks === "" || Number.isNaN(marksNum)) {
      next.marks = "Marks is required and must be a number.";
    } else if (marksNum < 0 || marksNum > 100) {
      next.marks = "Marks must be between 0 and 100.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await onSubmit({
      name: form.name.trim(),
      email: form.email.trim(),
      course: form.course.trim(),
      marks: Number(form.marks),
    });
    setSubmitting(false);
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{student ? "Edit student" : "Add student"}</h2>
        <form onSubmit={handleSubmit}>
          {submitError && <div className="form-error-banner">{submitError}</div>}

          <div className="form-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Aditi Sharma"
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="name@mail.com"
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="course">Course</label>
            <input
              id="course"
              type="text"
              value={form.course}
              onChange={(e) => handleChange("course", e.target.value)}
              placeholder="e.g. B.Tech CSE"
            />
            {errors.course && <div className="field-error">{errors.course}</div>}
          </div>

          <div className="form-field">
            <label htmlFor="marks">Marks (0-100)</label>
            <input
              id="marks"
              type="number"
              min="0"
              max="100"
              value={form.marks}
              onChange={(e) => handleChange("marks", e.target.value)}
              placeholder="e.g. 75"
            />
            {errors.marks && <div className="field-error">{errors.marks}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? "Saving..." : student ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

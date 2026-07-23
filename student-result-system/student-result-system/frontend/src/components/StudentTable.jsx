import { useState } from "react";

export default function StudentTable({ students, loading, onEdit, onDelete }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [confirmId, setConfirmId] = useState(null);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...students].sort((a, b) => {
    if (!sortKey) return 0;
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === "string") {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  function sortIndicator(key) {
    if (sortKey !== key) return "";
    return sortDir === "asc" ? " ^" : " v";
  }

  if (loading) {
    return (
      <div className="table-wrapper">
        <div className="loading-state">
          <div className="spinner" />
          <p>Loading students...</p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-wrapper">
        <div className="empty-state">No students found.</div>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th onClick={() => toggleSort("name")} style={{ cursor: "pointer" }}>
              Name{sortIndicator("name")}
            </th>
            <th>Email</th>
            <th onClick={() => toggleSort("course")} style={{ cursor: "pointer" }}>
              Course{sortIndicator("course")}
            </th>
            <th onClick={() => toggleSort("marks")} style={{ cursor: "pointer" }}>
              Marks{sortIndicator("marks")}
            </th>
            <th>Result</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.course}</td>
              <td>{student.marks}</td>
              <td>
                <span className={`badge ${student.result === "Pass" ? "badge-pass" : "badge-fail"}`}>
                  {student.result}
                </span>
              </td>
              <td>
                <button className="btn btn-icon" onClick={() => onEdit(student)}>
                  Edit
                </button>
                {confirmId === student.id ? (
                  <>
                    <button
                      className="btn btn-icon btn-danger-text"
                      onClick={() => {
                        onDelete(student.id);
                        setConfirmId(null);
                      }}
                    >
                      Confirm
                    </button>
                    <button className="btn btn-icon" onClick={() => setConfirmId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-icon btn-danger-text"
                    onClick={() => setConfirmId(student.id)}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

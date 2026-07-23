import { useState, useEffect, useCallback, useMemo } from "react";
import StatsCards from "./components/StatsCards";
import SearchBar from "./components/SearchBar";
import StudentTable from "./components/StudentTable";
import StudentForm from "./components/StudentForm";
import Toast from "./components/Toast";
import { fetchStudents, searchStudents, createStudent, updateStudent, deleteStudent } from "./api";

const PAGE_SIZE = 5;

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [courseFilter, setCourseFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formError, setFormError] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const pushToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const res = await fetchStudents();
      setStudents(res.data);
    } catch (err) {
      setLoadError("Couldn't load students. Is the backend running on port 5000?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudents();
  }, [loadStudents]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  async function handleSearch(name) {
    setLoading(true);
    try {
      const res = await searchStudents(name);
      setStudents(res.data);
      setPage(1);
    } catch (err) {
      pushToast(err.errors ? err.errors[0] : "Search failed.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleClearSearch() {
    loadStudents();
    setPage(1);
  }

  async function handleFormSubmit(data) {
    setFormError(null);
    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, data);
        pushToast("Student updated.");
      } else {
        await createStudent(data);
        pushToast("Student added.");
      }
      setShowForm(false);
      setEditingStudent(null);
      await loadStudents();
    } catch (err) {
      const message = err.errors ? err.errors.join(" ") : "Something went wrong.";
      setFormError(message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteStudent(id);
      pushToast("Student deleted.");
      await loadStudents();
    } catch (err) {
      pushToast(err.errors ? err.errors[0] : "Delete failed.", "error");
    }
  }

  function openAddForm() {
    setEditingStudent(null);
    setFormError(null);
    setShowForm(true);
  }

  function openEditForm(student) {
    setEditingStudent(student);
    setFormError(null);
    setShowForm(true);
  }

  const courses = useMemo(
    () => [...new Set(students.map((s) => s.course))].sort(),
    [students]
  );

  const filtered = useMemo(
    () => (courseFilter ? students.filter((s) => s.course === courseFilter) : students),
    [students, courseFilter]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="app">
      <div className="topbar">
        <h1>Student result management</h1>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={() => setDarkMode((d) => !d)}>
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
          <button className="btn btn-primary" onClick={openAddForm}>
            Add student
          </button>
        </div>
      </div>

      <StatsCards students={students} />

      <SearchBar
        onSearch={handleSearch}
        onClear={handleClearSearch}
        courses={courses}
        courseFilter={courseFilter}
        onCourseChange={(val) => {
          setCourseFilter(val);
          setPage(1);
        }}
      />

      {loadError ? (
        <div className="table-wrapper">
          <div className="empty-state">{loadError}</div>
        </div>
      ) : (
        <>
          <StudentTable
            students={paginated}
            loading={loading}
            onEdit={openEditForm}
            onDelete={handleDelete}
          />
          {!loading && filtered.length > PAGE_SIZE && (
            <div className="pagination">
              <button
                className="btn"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <StudentForm
          student={editingStudent}
          onCancel={() => {
            setShowForm(false);
            setEditingStudent(null);
          }}
          onSubmit={handleFormSubmit}
          submitError={formError}
        />
      )}

      <Toast toasts={toasts} />
    </div>
  );
}

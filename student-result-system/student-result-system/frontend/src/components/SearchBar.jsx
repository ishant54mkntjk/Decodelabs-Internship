import { useState } from "react";

export default function SearchBar({ onSearch, onClear, courses, courseFilter, onCourseChange }) {
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      onClear();
      return;
    }
    onSearch(trimmed);
  }

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (value.trim().length === 0) {
      onClear();
    }
  }

  return (
    <form className="controls" onSubmit={handleSubmit}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Search by name"
          value={query}
          onChange={handleChange}
        />
      </div>
      <select value={courseFilter} onChange={(e) => onCourseChange(e.target.value)}>
        <option value="">All courses</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <button type="submit" className="btn">
        Search
      </button>
    </form>
  );
}

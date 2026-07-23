export default function StatsCards({ students }) {
  const total = students.length;
  const passed = students.filter((s) => s.result === "Pass").length;
  const failed = total - passed;
  const average =
    total === 0
      ? 0
      : (students.reduce((sum, s) => sum + s.marks, 0) / total).toFixed(1);

  const cards = [
    { label: "Total students", value: total },
    { label: "Passed", value: passed },
    { label: "Failed", value: failed },
    { label: "Average marks", value: average },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card) => (
        <div className="stat-card" key={card.label}>
          <p className="stat-label">{card.label}</p>
          <p className="stat-value">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

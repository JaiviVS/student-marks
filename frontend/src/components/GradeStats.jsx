export default function GradeStats({ students }) {
  if (students.length === 0) return null;

  const avg = Math.round(students.reduce((s, x) => s + x.marks, 0) / students.length);
  const highest = Math.max(...students.map((s) => s.marks));
  const lowest = Math.min(...students.map((s) => s.marks));
  const passing = students.filter((s) => s.marks >= 50).length;

  const stats = [
    { label: "Average", value: `${avg}%`, color: "#60a5fa" },
    { label: "Highest", value: `${highest}%`, color: "#4ade80" },
    { label: "Lowest",  value: `${lowest}%`,  color: "#f87171" },
    { label: "Passing", value: `${passing}/${students.length}`, color: "#a78bfa" },
  ];

  return (
    <div className="card stats-card">
      <h2 className="card-title">Class Summary</h2>
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-item">
            <span className="stat-value" style={{ color: s.color }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
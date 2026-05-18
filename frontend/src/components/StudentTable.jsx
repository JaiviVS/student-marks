function getGrade(marks) {
  if (marks >= 90) return { label: "A+", color: "#22c55e" };
  if (marks >= 80) return { label: "A",  color: "#4ade80" };
  if (marks >= 70) return { label: "B",  color: "#60a5fa" };
  if (marks >= 60) return { label: "C",  color: "#facc15" };
  if (marks >= 50) return { label: "D",  color: "#fb923c" };
  return { label: "F", color: "#f87171" };
}

export default function StudentTable({ students, onDelete }) {
  if (students.length === 0) {
    return (
      <div className="card empty-state">
        <span className="empty-icon">🎓</span>
        <p>No students added yet.</p>
        <p className="empty-sub">Use the form to add your first entry.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Students ({students.length})</h2>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>#</th><th>Name</th><th>Subject</th><th>Marks</th><th>Grade</th><th></th></tr>
          </thead>
          <tbody>
            {students.map((s, i) => {
              const grade = getGrade(s.marks);
              return (
                <tr key={s.id}>
                  <td className="muted">{students.length - i}</td>
                  <td className="name-cell">{s.name}</td>
                  <td>{s.subject}</td>
                  <td>
                    <div className="marks-bar-wrap">
                      <span className="marks-num">{s.marks}</span>
                      <div className="marks-bar">
                        <div className="marks-fill" style={{ width: `${s.marks}%`, background: grade.color }} />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="grade-badge" style={{ color: grade.color, borderColor: grade.color }}>
                      {grade.label}
                    </span>
                  </td>
                  <td>
                    <button className="btn-delete" onClick={() => onDelete(s.id)} title="Delete">✕</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
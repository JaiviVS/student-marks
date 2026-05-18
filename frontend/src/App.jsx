import { useState, useEffect } from "react";
import StudentForm from "./components/StudentForm";
import StudentTable from "./components/StudentTable";
import GradeStats from "./components/GradeStats";
import "./App.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API}/api/students`);
      const data = await res.json();
      setStudents(data);
    } catch {
      setError("Could not connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleAdd = async (student) => {
    const res = await fetch(`${API}/api/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    if (res.ok) {
      const newStudent = await res.json();
      setStudents((prev) => [newStudent, ...prev]);
    } else {
      const err = await res.json();
      throw new Error(err.detail || "Failed to add student");
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API}/api/students/${id}`, { method: "DELETE" });
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">GradeTracker</span>
          </div>
          <p className="tagline">Student Performance Dashboard</p>
        </div>
      </header>
      <main className="main">
        {error && <div className="error-banner">{error}</div>}
        <div className="grid">
          <div className="left-col">
            <StudentForm onAdd={handleAdd} />
            <GradeStats students={students} />
          </div>
          <div className="right-col">
            {loading ? (
              <div className="loading">Loading students...</div>
            ) : (
              <StudentTable students={students} onDelete={handleDelete} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
import { useState } from "react";

export default function StudentForm({ onAdd }) {
  const [form, setForm] = useState({ name: "", subject: "", marks: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const marks = parseInt(form.marks);
    if (!form.name.trim() || !form.subject.trim()) {
      setError("Name and subject are required.");
      return;
    }
    if (isNaN(marks) || marks < 0 || marks > 100) {
      setError("Marks must be between 0 and 100.");
      return;
    }
    setSubmitting(true);
    try {
      await onAdd({ name: form.name, subject: form.subject, marks });
      setForm({ name: "", subject: "", marks: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Add Student</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label>Student Name</label>
          <input type="text" placeholder="e.g. Jai Vardhan" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="field">
          <label>Subject</label>
          <input type="text" placeholder="e.g. Mathematics" value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </div>
        <div className="field">
          <label>Marks (0–100)</label>
          <input type="number" placeholder="e.g. 87" value={form.marks} min={0} max={100}
            onChange={(e) => setForm({ ...form, marks: e.target.value })} />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add Student"}
        </button>
      </form>
    </div>
  );
}
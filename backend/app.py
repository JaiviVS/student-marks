from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.environ.get("DB_PATH", "marks.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            marks INTEGER NOT NULL
        )
    """)
    conn.commit()
    conn.close()

init_db()

class StudentIn(BaseModel):
    name: str
    subject: str
    marks: int

@app.get("/api/students")
def get_students():
    conn = get_db()
    rows = conn.execute("SELECT * FROM students ORDER BY id DESC").fetchall()
    conn.close()
    return [dict(r) for r in rows]

@app.post("/api/students", status_code=201)
def add_student(student: StudentIn):
    if not (0 <= student.marks <= 100):
        raise HTTPException(status_code=400, detail="Marks must be between 0 and 100")
    conn = get_db()
    cursor = conn.execute(
        "INSERT INTO students (name, subject, marks) VALUES (?, ?, ?)",
        (student.name.strip(), student.subject.strip(), student.marks)
    )
    conn.commit()
    row = conn.execute("SELECT * FROM students WHERE id = ?", (cursor.lastrowid,)).fetchone()
    conn.close()
    return dict(row)

@app.delete("/api/students/{student_id}")
def delete_student(student_id: int):
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()
    return {"message": "Deleted"}

@app.get("/api/health")
def health():
    return {"status": "ok"}
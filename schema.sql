DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nim TEXT NOT NULL,
    pin TEXT NOT NULL,
    proposalDate TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    bab3CompletedAt TEXT,
    bab4CompletedAt TEXT,
    bab5CompletedAt TEXT
);

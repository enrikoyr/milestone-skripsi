DROP TABLE IF EXISTS students;

CREATE TABLE students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    nim TEXT NOT NULL,
    pin TEXT NOT NULL,
    startDate TEXT NOT NULL,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    bab1CompletedAt TEXT,
    bab2CompletedAt TEXT,
    bab3CompletedAt TEXT,
    propDefenseCompletedAt TEXT,
    bab4CompletedAt TEXT,
    bab5CompletedAt TEXT,
    finalDefenseCompletedAt TEXT
);

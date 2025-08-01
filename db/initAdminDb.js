const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'data', 'admin.db');
const db = new Database(dbPath);

// Δημιουργία πίνακα αν δεν υπάρχει
db.prepare(`
  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    verified INTEGER DEFAULT 0,
    verification_token TEXT,
    reset_token TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log('✅ Admin DB initialized');

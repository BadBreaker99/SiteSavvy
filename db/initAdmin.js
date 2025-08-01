const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// 🔐 Πάρε το ID του admin (π.χ. από μεταβλητή ή προσωρινά manual)
const adminId = 'demo-admin-id'; // αντικατέστησέ το με δυναμικό ID αν θες
const dbName = `admin-${adminId}.db`;
const dbPath = path.join(__dirname, '..', 'data', 'admins', dbName);

// 🛠 Δημιούργησε τον φάκελο αν δεν υπάρχει
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// 🧱 Σύνδεση και δημιουργία βασικών πινάκων
const db = new Database(dbPath);

// Δημιουργία πίνακα clients (μπορείς να προσθέσεις κι άλλους)
db.prepare(`
  CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`).run();

console.log(`✅ Created DB for admin: ${adminId}`);

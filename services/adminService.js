const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

// Path to main admin database
const mainDb = new Database(path.join(process.cwd(), 'data', 'admin.db'));

// Create admins table if it doesn't exist
mainDb.prepare(`
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

function createAdmin(admin) {
  const stmt = mainDb.prepare(`
    INSERT INTO admins (id, email, password_hash, verification_token)
    VALUES (@id, @email, @password_hash, @verification_token)
  `);
  stmt.run(admin);

  // 🔧 Init new DB for this admin
  initAdminDb(admin.id);
}

function initAdminDb(adminId) {
  const adminDbPath = path.join(process.cwd(), 'data', 'admins', `admin-${adminId}.db`);
  fs.mkdirSync(path.dirname(adminDbPath), { recursive: true });

  const db = new Database(adminDbPath);
  db.pragma('journal_mode = WAL');

  // 👇 μπορείς να προσθέσεις όσους πίνακες θες
  db.prepare(`
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS emails (
      id TEXT PRIMARY KEY,
      recipient TEXT,
      subject TEXT,
      body TEXT,
      sent_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  console.log(`📁 Created personal DB for admin: admin-${adminId}.db`);
}

function getAdminDb(adminId) {
  const dbPath = path.join(process.cwd(), 'data', 'admins', `admin-${adminId}.db`);
  return new Database(dbPath);
}

module.exports = {
  // MAIN DB operations
  createAdmin,
  findByEmail(email) {
    return mainDb.prepare(`SELECT * FROM admins WHERE email = ?`).get(email);
  },
  findByToken(token) {
    return mainDb.prepare(`SELECT * FROM admins WHERE verification_token = ?`).get(token);
  },
  verifyAdmin(token) {
    return mainDb.prepare(`
      UPDATE admins SET verified = 1, verification_token = NULL
      WHERE verification_token = ?
    `).run(token);
  },
  updateResetToken(email, token) {
    return mainDb.prepare(`
      UPDATE admins SET reset_token = ? WHERE email = ?
    `).run(token, email);
  },
  resetPassword(token, newHash) {
    return mainDb.prepare(`
      UPDATE admins SET password_hash = ?, reset_token = NULL
      WHERE reset_token = ?
    `).run(newHash, token);
  },

  // NEW utilities
  initAdminDb,
  getAdminDb
};

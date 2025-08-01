const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(process.cwd(), 'data', 'admin.db'));

module.exports = {
  createAdmin(admin) {
    const stmt = db.prepare(`
      INSERT INTO admins (id, email, password_hash, verification_token)
      VALUES (@id, @email, @password_hash, @verification_token)
    `);
    stmt.run(admin);
  },

  findByEmail(email) {
    return db.prepare(`SELECT * FROM admins WHERE email = ?`).get(email);
  },

  findByToken(token) {
    return db.prepare(`SELECT * FROM admins WHERE verification_token = ?`).get(token);
  },

  verifyAdmin(token) {
    return db.prepare(`
      UPDATE admins SET verified = 1, verification_token = NULL
      WHERE verification_token = ?
    `).run(token);
  },

  updateResetToken(email, token) {
    return db.prepare(`
      UPDATE admins SET reset_token = ? WHERE email = ?
    `).run(token, email);
  },

  resetPassword(token, newHash) {
    return db.prepare(`
      UPDATE admins SET password_hash = ?, reset_token = NULL
      WHERE reset_token = ?
    `).run(newHash, token);
  }
};

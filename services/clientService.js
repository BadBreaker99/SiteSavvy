// services/clientService.js
const { getAdminDb } = require('./adminService');

function getClients(adminId) {
  const db = getAdminDb(adminId);
  return db.prepare('SELECT * FROM clients').all();
}

function addClient(adminId, client) {
  const db = getAdminDb(adminId);
  const stmt = db.prepare(`
    INSERT INTO clients (id, name, email, phone)
    VALUES (@id, @name, @email, @phone)
  `);
  stmt.run(client);
}

module.exports = {
  getClients,
  addClient
};

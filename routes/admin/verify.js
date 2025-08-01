const express = require('express');
const { findByToken, verifyAdmin } = require('../../services/adminService');
const router = express.Router();

router.get('/admin/verify', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).send('Λείπει το verification token.');
  }

  const admin = findByToken(token);
  if (!admin) {
    return res.status(400).send('Μη έγκυρο ή ληγμένο token.');
  }

  verifyAdmin(token);
  res.send(`
    <h2>✅ Ο λογαριασμός σου ενεργοποιήθηκε!</h2>
    <p>Μπορείς τώρα να <a href="/admin/login">συνδεθείς</a>.</p>
  `);
});

module.exports = router;

const express = require('express');
const router = express.Router();

router.get('/admin/dashboard', (req, res) => {
  if (!req.session.adminId) {
    return res.redirect('/admin/login');
  }

  res.send(`
    <h2>🎉 Καλώς ήρθες, ${req.session.email}</h2>
    <p><a href="/admin/logout">Αποσύνδεση</a></p>
  `);
});

module.exports = router;

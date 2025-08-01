const express = require('express');
const bcrypt = require('bcrypt');
const { findByEmail } = require('../../services/adminService');

const router = express.Router();

router.get('/admin/login', (req, res) => {
  if (req.session.adminId) return res.redirect('/admin/panel');
  res.render('admin/login', { title: 'Admin Login' });
});

router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = findByEmail(email);
  if (!admin || !admin.verified) return res.status(403).send('Λάθος ή μη επιβεβαιωμένος λογαριασμός');

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) return res.status(401).send('Λάθος κωδικός');

  req.session.adminId = admin.id;
  req.session.email = admin.email;

  res.redirect('/admin/panel');
});

router.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;

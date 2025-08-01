const express = require('express');
const bcrypt = require('bcrypt');
const { findByEmail } = require('../../services/adminService');

const router = express.Router();
router.get('/admin/login', (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }

  res.render('admin/login'); // αν χρησιμοποιείς EJS
  // ή res.sendFile(path.join(__dirname, '../views/admin/login.html'));
});
// GET login form
router.get('/admin/login', (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login');
});

// POST login logic
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = findByEmail(email);

  if (!admin) {
    return res.status(401).send('Λάθος email ή κωδικός.');
  }

  if (!admin.verified) {
    return res.status(403).send('Ο λογαριασμός δεν έχει επιβεβαιωθεί.');
  }

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    return res.status(401).send('Λάθος email ή κωδικός.');
  }

  req.session.adminId = admin.id;
  req.session.email = admin.email;

  res.redirect('/admin/dashboard');
});


// GET logout
router.get('/admin/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin/login');
  });
});

module.exports = router;

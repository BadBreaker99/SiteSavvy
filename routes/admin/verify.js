const express = require('express');
const { findByToken, verifyAdmin } = require('../../services/adminService');
const router = express.Router();

router.get('/admin/verify', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).render('admin/verify-fail', {
      title: 'Αποτυχία Επαλήθευσης',
      message: '❌ Λείπει το verification token.'
    });
  }

  const admin = findByToken(token);
  if (!admin) {
    return res.status(400).render('admin/verify-fail', {
      title: 'Αποτυχία Επαλήθευσης',
      message: '❌ Μη έγκυρο ή ληγμένο token.'
    });
  }

  verifyAdmin(token);
  return res.render('admin/verify-success', {
    title: 'Επιβεβαίωση Ολοκληρώθηκε'
  });
});


module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createAdmin, findByEmail } = require('../../services/adminService');
const { v4: uuidv4 } = require('uuid');
const { sendVerificationEmail } = require('../../services/mailer');

const router = express.Router();

router.get('/admin/register', (req, res) => {
  res.render('admin/register', {
    title: 'Εγγραφή Admin',
    message: null,
    success: null
  });
});

router.post('/admin/register', async (req, res) => {
  const { email, password, gdpr_consent } = req.body;

  if (!email || !password || gdpr_consent !== 'on') {
    return res.render('admin/register', {
      title: 'Εγγραφή Admin',
      message: 'Απαιτείται email, κωδικός και αποδοχή GDPR.',
      success: false
    });
  }

  const existingAdmin = findByEmail(email);

  if (existingAdmin) {
    if (!existingAdmin.verified) {
      try {
        await sendVerificationEmail(existingAdmin.email, existingAdmin.verification_token);
        return res.render('admin/register', {
          title: 'Εγγραφή Admin',
          message: '🔁 Το email υπάρχει αλλά δεν έχει επιβεβαιωθεί. Σου στείλαμε νέο email επιβεβαίωσης.',
          success: true
        });
      } catch (err) {
        console.error('❌ Αποτυχία αποστολής email:', err);
        return res.render('admin/register', {
          title: 'Εγγραφή Admin',
          message: '❌ Αποτυχία αποστολής email επιβεβαίωσης.',
          success: false
        });
      }
    }

    return res.render('admin/register', {
      title: 'Εγγραφή Admin',
      message: 'Αυτό το email είναι ήδη καταχωρημένο.',
      success: false
    });
  }

  const password_hash = await bcrypt.hash(password, 10);
  const verification_token = crypto.randomUUID();

  const newAdmin = {
    id: uuidv4(),
    email,
    password_hash,
    verified: false,
    verification_token
  };

  createAdmin(newAdmin);

  try {
    console.log('🧪 Τύπος του sendVerificationEmail:', typeof sendVerificationEmail);

    await sendVerificationEmail(email, verification_token);
    res.render('admin/register', {
      title: 'Εγγραφή Admin',
      message: '📧 Έγινε εγγραφή! Έλεγξε το email σου για επιβεβαίωση.',
      success: true
    });
  } catch (err) {
    console.error('❌ Αποτυχία αποστολής email:', err);
    res.render('admin/register', {
      title: 'Εγγραφή Admin',
      message: 'Η αποστολή email απέτυχε.',
      success: false
    });
  }
});

module.exports = router;

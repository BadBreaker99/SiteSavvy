const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createAdmin, findByEmail } = require('../../services/adminService');
const { sendVerificationEmail } = require('../../services/mailer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

router.post('/admin/register', async (req, res) => {
  const { email, password, gdpr_consent } = req.body;

  if (!email || !password || gdpr_consent !== 'on') {
    return res.status(400).send('Απαιτείται email, κωδικός και αποδοχή GDPR.');
  }

  const existing = findByEmail(email);
  if (existing) {
    return res.status(400).send('Αυτό το email είναι ήδη καταχωρημένο.');
  }

  const password_hash = await bcrypt.hash(password, 10);
  const verification_token = crypto.randomUUID();
  const newAdmin = {
    id: uuidv4(),
    email,
    password_hash,
    verification_token
  };

  createAdmin(newAdmin);

  try {
    await sendVerificationEmail(email, verification_token);
    res.send('📧 Έγινε εγγραφή! Έλεγξε το email σου για επιβεβαίωση.');
  } catch (err) {
    console.error('❌ Αποτυχία αποστολής email:', err);
    res.status(500).send('Η αποστολή email απέτυχε.');
  }
});

module.exports = router;

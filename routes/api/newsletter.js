const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const {sendConfirmationEmail } = require('../../services/mailer');
const router = express.Router();
const CSV_PATH = path.join(process.cwd(), 'data', 'newsletter.csv');

if (!fs.existsSync(CSV_PATH)) {
  fs.writeFileSync(CSV_PATH, 'email,consent,timestamp,unsub_token\n');
}

router.post('/newsletter', async (req, res) => {
      console.log('🔔 POST /newsletter received');
  console.log('BODY:', req.body);
  const { email, gdpr_consent } = req.body;

  if (!email || !gdpr_consent) {
    return res.status(400).send('Απαραίτητη συγκατάθεση και email.');
  }
  const existingLines = fs.readFileSync(CSV_PATH, 'utf8').split('\n');
const emailExists = existingLines.some(line => line.startsWith(email + ','));

if (emailExists) {
  return res.status(400).send('Αυτό το email είναι ήδη εγγεγραμμένο.');
}

  const token = crypto.randomUUID();
  const line = `${email},yes,${new Date().toISOString()},${token}\n`;
  fs.appendFileSync(CSV_PATH, line);

  try {
    await sendConfirmationEmail(email, token);
    console.log(`📧 Email sent to ${email}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }

  res.redirect('/?subscribed=true');
});



module.exports = router;

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/send-appointment', async (req, res) => {
  const { name, email, date, time, message } = req.body;

  if (!name || !email || !date || !time) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for port 465
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"SiteSavvy" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      subject: '📅 Νέο Ραντεβού',
      text: `Όνομα: ${name}\nEmail: ${email}\nΗμερομηνία: ${date}\nΏρα: ${time}\nΜήνυμα: ${message || '—'}`,
    });

    console.log('✅ Email sent:', info.messageId);
    res.json({ success: true, message: 'Επιτυχής καταχώρηση ραντεβού.' });
  } catch (error) {
    console.error('❌ Email error:', error);
    res.status(500).json({ success: false, message: 'Σφάλμα αποστολής email.' });
  }
});

module.exports = router;

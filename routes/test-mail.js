require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: true,
  requireTLS: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

transporter.sendMail({
  from: `"SiteSavvy" <${process.env.MAIL_USER}>`,
  to: process.env.MAIL_USER,
  subject: '🔔 Test Email',
  text: 'Αυτό είναι ένα δοκιμαστικό email από Node.js server σου.',
}, (err, info) => {
  if (err) {
    console.error('❌ Failed to send:', err);
  } else {
    console.log('✅ Email sent:', info.response);
  }
});

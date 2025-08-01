const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

function sendConfirmationEmail(to, token) {
  const baseUrl = process.env.APP_BASE_URL;

  return transporter.sendMail({
    from: `"SiteSavvy" <${process.env.SMTP_USER}>`,
    to,
    subject: '✅ Επιβεβαίωση εγγραφής στο Newsletter',
    html: `
      <h2 style="color:#3C9D2F;">🎉 Καλώς ήρθες στο SiteSavvy</h2>
      <p style="font-size:16px;">
        Σε ευχαριστούμε για την εγγραφή σου στο newsletter μας.<br>
        Θα λαμβάνεις νέα, συμβουλές και προσφορές μας απευθείας στο email σου!
      </p>
      <hr>
      <p style="font-size:14px;">
        Αν δε θέλεις να λαμβάνεις άλλα email, μπορείς να 
        <a href="${baseUrl}/unsubscribe?token=${token}">Απεγγραφή</a>.
      </p>
    `,
  });
}
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP verification failed:', error);
  } else {
    console.log('✅ SMTP is ready to send emails');
  }
});

async function sendVerificationEmail(email, token) {
  const verificationLink = `${process.env.APP_BASE_URL}/admin/verify?token=${token}`;
  console.log('✉️ Ετοιμάζουμε αποστολή email σε:', email);
  console.log('🔗 Verification Link:', verificationLink);

  try {
    const info = await transporter.sendMail({
      to: email,
      from: `"SiteSavvy" <${process.env.SMTP_USER}>`,
      subject: 'Επιβεβαίωση Λογαριασμού Admin',
      html: `
        <h2>Καλωσήρθες!</h2>
        <p>Κάνε κλικ παρακάτω για να επιβεβαιώσεις τον λογαριασμό σου:</p>
        <a href="${verificationLink}">${verificationLink}</a>
      `
    });

    console.log('📤 Email info:', info);
  } catch (err) {
    console.error('❌ SendMail Error:', err);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendVerificationEmail
};

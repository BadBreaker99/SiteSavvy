import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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

export function sendConfirmationEmail(to, token) {
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
async function sendVerificationEmail(email, token) {
  const verificationLink = `https://yourdomain.com/admin/verify?token=${token}`;

  await transporter.sendMail({
    to: email,
    subject: 'Επιβεβαίωση Λογαριασμού Admin',
    html: `
      <h2>Καλωσήρθες!</h2>
      <p>Κάνε κλικ παρακάτω για να επιβεβαιώσεις τον λογαριασμό σου:</p>
      <a href="${verificationLink}">${verificationLink}</a>
    `
  });
}


// test-mail.js
const { sendVerificationEmail } = require('./services/mailer');

(async () => {
  const testEmail = 'markopanos1999@gmail.com'; // Βάλε πραγματικό email που ελέγχεις
  const testToken = 'test-token-123';
  
  try {
    await sendVerificationEmail(testEmail, testToken);
    console.log('📨 Test email sent');
  } catch (err) {
    console.error('❌ Test email failed:', err);
  }
})();

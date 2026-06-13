require('./load-dotenv').loadAppEnv();
const { isContactMailConfigured, sendContactMessageEmail } = require('../src/services/mailService');

async function main() {
  console.log('MAIL_CONTACT_TO:', process.env.MAIL_CONTACT_TO || process.env.MAIL_TO || '(none)');
  console.log('SMTP_USER:', process.env.SMTP_USER || '(none)');
  console.log('configured:', isContactMailConfigured());
  await sendContactMessageEmail({
    fromEmail: 'test@portal.lt1.ro',
    fromName: 'Test SMTP',
    message: 'Verificare trimitere contact — Portal LT1',
    messageId: 'TEST-SMTP',
    sentAt: new Date()
  });
  console.log('OK: email sent');
}

main().catch((err) => {
  console.error('FAIL:', err.message);
  process.exit(1);
});

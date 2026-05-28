const nodemailer = require('nodemailer');

function isMailConfigured() {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.MAIL_FROM
  );
}

let transporter;

function getTransporter() {
  if (!isMailConfigured()) {
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
}

async function sendLoginOtpEmail({ to, code, expiresMinutes = 10 }) {
  const transport = getTransporter();
  if (!transport) {
    throw new Error('SMTP nu este configurat.');
  }

  const subject = 'Cod de autentificare — Portal LT1';
  const text = [
    'Ai initiat autentificarea in Portal LT1.',
    '',
    `Codul tau de verificare (expira in ${expiresMinutes} minute): ${code}`,
    '',
    'Daca nu ai incercat sa te autentifici, ignora acest mesaj.'
  ].join('\n');

  const html = `
    <p>Ai initiat autentificarea in <strong>Portal LT1</strong>.</p>
    <p>Codul tau de verificare (valabil ${expiresMinutes} minute):</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:0.2em;color:#1a3270;">${code}</p>
    <p style="color:#666;font-size:14px;">Daca nu ai incercat sa te autentifici, ignora acest mesaj.</p>
  `;

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
}

async function sendEmailVerificationEmail({ to, code, expiresMinutes = 10 }) {
  const transport = getTransporter();
  if (!transport) {
    throw new Error('SMTP nu este configurat.');
  }

  const subject = 'Activare cont — Portal LT1';
  const text = [
    'Bine ai venit in Portal LT1.',
    '',
    `Codul tau de activare (expira in ${expiresMinutes} minute): ${code}`,
    '',
    'Introdu codul pe pagina de inregistrare pentru a-ti activa contul.',
    'Daca nu ai creat un cont, ignora acest mesaj.'
  ].join('\n');

  const html = `
    <p>Bine ai venit in <strong>Portal LT1</strong>.</p>
    <p>Codul tau de activare (valabil ${expiresMinutes} minute):</p>
    <p style="font-size:28px;font-weight:700;letter-spacing:0.2em;color:#1a3270;">${code}</p>
    <p style="color:#666;font-size:14px;">Introdu codul pe pagina de inregistrare. Daca nu ai creat un cont, ignora acest mesaj.</p>
  `;

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
}

async function sendPasswordResetEmail({ to, resetUrl, expiresMinutes = 60 }) {
  const transport = getTransporter();
  if (!transport) {
    throw new Error('SMTP nu este configurat.');
  }

  const subject = 'Resetare parola — Portal LT1';
  const text = [
    'Ai solicitat resetarea parolei pentru contul tau Portal LT1.',
    '',
    `Deschide linkul de mai jos (expira in ${expiresMinutes} minute):`,
    resetUrl,
    '',
    'Daca nu ai cerut resetarea, ignora acest mesaj.'
  ].join('\n');

  const html = `
    <p>Ai solicitat resetarea parolei pentru contul tau <strong>Portal LT1</strong>.</p>
    <p><a href="${resetUrl}">Reseteaza parola</a> (link valabil ${expiresMinutes} minute).</p>
    <p style="color:#666;font-size:14px;">Daca nu ai cerut resetarea, ignora acest mesaj.</p>
  `;

  await transport.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html
  });
}

module.exports = {
  isMailConfigured,
  sendLoginOtpEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail
};

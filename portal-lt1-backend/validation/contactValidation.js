const { validateEmail } = require('./commonValidation');

function validateContactMessage(input) {
  const errors = {};
  const senderEmailRaw = input.sender_email;
  const senderName = input.sender_name && typeof input.sender_name === 'string' ? input.sender_name.trim() : '';
  const message = input.message && typeof input.message === 'string' ? input.message.trim() : '';

  const emailCheck = validateEmail(senderEmailRaw);
  if (emailCheck.errors.email) {
    errors.sender_email = 'Email-ul nu are un format valid.';
  }

  if (!message) {
    errors.message = 'Mesajul este obligatoriu.';
  } else if (message.length < 10 || message.length > 2000) {
    errors.message = 'Mesajul trebuie sa aiba intre 10 si 2000 de caractere.';
  }

  return {
    errors,
    sanitized: {
      sender_email: emailCheck.value,
      sender_name: senderName,
      message
    }
  };
}

module.exports = {
  validateContactMessage
};


function validateEmail(input) {
  const errors = {};
  const value = typeof input === 'string' ? input.trim().toLowerCase() : '';

  if (!value) {
    errors.email = 'Email-ul este obligatoriu.';
  } else if (value.length > 254) {
    errors.email = 'Email-ul este prea lung.';
  } else {
    // Practical (not fully RFC) email validation.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(value)) {
      errors.email = 'Email invalid.';
    }
  }

  return { errors, value };
}

module.exports = {
  validateEmail
};


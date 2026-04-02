const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value) {
  return (value ?? '').trim();
}

export function validateLogin(input) {
  const errors = {};
  const email = text(input.email);
  const password = input.password ?? '';

  if (!email) {
    errors.email = 'Email-ul este obligatoriu.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email-ul nu are un format valid.';
  }

  if (!password.trim()) {
    errors.password = 'Parola este obligatorie.';
  } else if (password.length < 6) {
    errors.password = 'Parola trebuie sa aiba minimum 6 caractere.';
  }

  return errors;
}

export function validateRegister(input) {
  const errors = {};
  const name = text(input.name);
  const email = text(input.email);
  const password = input.password ?? '';
  const confirmPassword = input.confirmPassword ?? '';

  if (!name) {
    errors.name = 'Numele este obligatoriu.';
  } else if (name.length < 3) {
    errors.name = 'Numele trebuie sa aiba minimum 3 caractere.';
  }

  if (!email) {
    errors.email = 'Email-ul este obligatoriu.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email-ul nu are un format valid.';
  }

  if (!password.trim()) {
    errors.password = 'Parola este obligatorie.';
  } else if (password.length < 8) {
    errors.password = 'Parola trebuie sa aiba minimum 8 caractere.';
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = 'Confirmarea parolei este obligatorie.';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Parolele nu coincid.';
  }

  return errors;
}

export function validateContact(input) {
  const errors = {};
  const name = text(input.name);
  const email = text(input.email);
  const message = text(input.message);

  if (!name) {
    errors.name = 'Numele este obligatoriu.';
  } else if (name.length < 3) {
    errors.name = 'Numele trebuie sa aiba minimum 3 caractere.';
  }

  if (!email) {
    errors.email = 'Email-ul este obligatoriu.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Email-ul nu are un format valid.';
  }

  if (!message) {
    errors.message = 'Mesajul este obligatoriu.';
  } else if (message.length < 10) {
    errors.message = 'Mesajul trebuie sa aiba minimum 10 caractere.';
  }

  return errors;
}


export function validateDocument(input) {
  const errors = {};

  if (!input.title?.trim()) {
    errors.title = 'Titlul este obligatoriu.';
  }

  if (!input.category?.trim()) {
    errors.category = 'Categoria este obligatorie.';
  }

  if (!input.issuer?.trim()) {
    errors.issuer = 'Emitentul este obligatoriu.';
  }

  if (!input.issuedAt) {
    errors.issuedAt = 'Data emiterii este obligatorie.';
  }

  if (!input.status?.trim()) {
    errors.status = 'Statusul este obligatoriu.';
  }

  if (!input.description?.trim()) {
    errors.description = 'Descrierea este obligatorie.';
  } else if (input.description.trim().length < 10) {
    errors.description = 'Descrierea trebuie sa aiba minimum 10 caractere.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

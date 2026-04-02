export function validateDocument(input) {
  const errors = {};
  const allowedStatuses = ['Activ', 'Revizie', 'Arhivat'];
  const title = input.title?.trim() ?? '';
  const category = input.category?.trim() ?? '';
  const issuer = input.issuer?.trim() ?? '';
  const description = input.description?.trim() ?? '';

  if (!title) {
    errors.title = 'Titlul este obligatoriu.';
  } else if (title.length < 3) {
    errors.title = 'Titlul trebuie sa aiba minimum 3 caractere.';
  } else if (title.length > 120) {
    errors.title = 'Titlul poate avea maximum 120 de caractere.';
  }

  if (!category) {
    errors.category = 'Categoria este obligatorie.';
  } else if (category.length < 2) {
    errors.category = 'Categoria trebuie sa aiba minimum 2 caractere.';
  } else if (category.length > 60) {
    errors.category = 'Categoria poate avea maximum 60 de caractere.';
  }

  if (!issuer) {
    errors.issuer = 'Emitentul este obligatoriu.';
  } else if (issuer.length < 2) {
    errors.issuer = 'Emitentul trebuie sa aiba minimum 2 caractere.';
  } else if (issuer.length > 80) {
    errors.issuer = 'Emitentul poate avea maximum 80 de caractere.';
  }

  if (!input.issuedAt) {
    errors.issuedAt = 'Data emiterii este obligatorie.';
  } else if (Number.isNaN(new Date(input.issuedAt).getTime())) {
    errors.issuedAt = 'Data emiterii nu este valida.';
  }

  if (!input.status?.trim()) {
    errors.status = 'Statusul este obligatoriu.';
  } else if (!allowedStatuses.includes(input.status)) {
    errors.status = 'Statusul selectat nu este valid.';
  }

  if (!description) {
    errors.description = 'Descrierea este obligatorie.';
  } else if (description.length < 10) {
    errors.description = 'Descrierea trebuie sa aiba minimum 10 caractere.';
  } else if (description.length > 1000) {
    errors.description = 'Descrierea poate avea maximum 1000 de caractere.';
  }

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

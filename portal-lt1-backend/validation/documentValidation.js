const allowedStatuses = ['Activ', 'Revizie', 'Arhivat'];

function validateDocument(input) {
  const errors = {};
  const title = input.title && typeof input.title === 'string' ? input.title.trim() : '';
  const category = input.category && typeof input.category === 'string' ? input.category.trim() : '';
  const issuer = input.issuer && typeof input.issuer === 'string' ? input.issuer.trim() : '';
  const description = input.description && typeof input.description === 'string' ? input.description.trim() : '';
  const status = input.status && typeof input.status === 'string' ? input.status.trim() : '';

  if (!title) {
    errors.title = 'Titlul este obligatoriu.';
  } else if (title.length < 3 || title.length > 120) {
    errors.title = 'Titlul trebuie sa aiba intre 3 si 120 de caractere.';
  }

  if (!category) {
    errors.category = 'Categoria este obligatorie.';
  } else if (category.length < 2 || category.length > 60) {
    errors.category = 'Categoria trebuie sa aiba intre 2 si 60 de caractere.';
  }

  if (!issuer) {
    errors.issuer = 'Emitentul este obligatoriu.';
  } else if (issuer.length < 2 || issuer.length > 80) {
    errors.issuer = 'Emitentul trebuie sa aiba intre 2 si 80 de caractere.';
  }

  if (!input.issuedAt) {
    errors.issuedAt = 'Data emiterii este obligatorie.';
  } else if (Number.isNaN(new Date(input.issuedAt).getTime())) {
    errors.issuedAt = 'Data emiterii nu este valida.';
  }

  if (!status) {
    errors.status = 'Statusul este obligatoriu.';
  } else if (!allowedStatuses.includes(status)) {
    errors.status = 'Statusul selectat nu este valid.';
  }

  if (!description) {
    errors.description = 'Descrierea este obligatorie.';
  } else if (description.length < 10 || description.length > 1000) {
    errors.description = 'Descrierea trebuie sa aiba intre 10 si 1000 de caractere.';
  }

  return { errors, sanitized: { title, category, issuer, issuedAt: input.issuedAt, status, description } };
}

function validatePagination(pageRaw, limitRaw) {
  const page = Number.parseInt(pageRaw || '1', 10);
  const limit = Number.parseInt(limitRaw || '5', 10);
  const errors = {};

  if (Number.isNaN(page) || page < 1) {
    errors.page = 'Parametrul page trebuie sa fie un numar pozitiv.';
  }

  if (Number.isNaN(limit) || limit < 1 || limit > 100) {
    errors.limit = 'Parametrul limit trebuie sa fie intre 1 si 100.';
  }

  return { errors, page, limit };
}

module.exports = {
  allowedStatuses,
  validateDocument,
  validatePagination
};

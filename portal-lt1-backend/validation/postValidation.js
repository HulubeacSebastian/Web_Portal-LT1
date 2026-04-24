function validatePost(input) {
  const errors = {};
  const title = input.title && typeof input.title === 'string' ? input.title.trim() : '';
  const content = input.content && typeof input.content === 'string' ? input.content.trim() : '';
  const category_id = input.category_id && typeof input.category_id === 'string' ? input.category_id.trim() : '';
  const image_url = input.image_url && typeof input.image_url === 'string' ? input.image_url.trim() : '';
  const is_published = input.is_published !== false;

  if (!title) {
    errors.title = 'Titlul este obligatoriu.';
  } else if (title.length < 3 || title.length > 120) {
    errors.title = 'Titlul trebuie sa aiba intre 3 si 120 de caractere.';
  }

  if (!content) {
    errors.content = 'Continutul este obligatoriu.';
  } else if (content.length < 10 || content.length > 5000) {
    errors.content = 'Continutul trebuie sa aiba intre 10 si 5000 de caractere.';
  }

  if (!category_id) {
    errors.category_id = 'Categoria este obligatorie.';
  } else if (category_id.length < 2 || category_id.length > 40) {
    errors.category_id = 'Categoria trebuie sa aiba intre 2 si 40 de caractere.';
  }

  if (image_url && image_url.length > 500) {
    errors.image_url = 'Link-ul imaginii este prea lung.';
  }

  return { errors, sanitized: { title, content, category_id, image_url, is_published } };
}

module.exports = {
  validatePost
};


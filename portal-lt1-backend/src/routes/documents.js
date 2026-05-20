const express = require('express');
const service = require('../services/documentService');
const { validateDocument, validatePagination } = require('../validation/documentValidation');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', function (req, res) {
  const { errors, page, limit } = validatePagination(req.query.page, req.query.limit);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Parametri de paginare invalizi.', errors });
  }

  const result = service.listDocuments({
    page,
    limit,
    query: req.query.query || '',
    status: req.query.status || ''
  });

  return res.json(result);
});

router.get('/:id', function (req, res) {
  const document = service.getDocument(req.params.id);
  if (!document) {
    return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
  }

  return res.json(document);
});

router.post('/', requireAuth, function (req, res) {
  const { errors, sanitized } = validateDocument(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru creare.', errors });
  }

  const created = service.addDocument(sanitized);
  return res.status(201).json(created);
});

router.put('/:id', requireAuth, function (req, res) {
  const existing = service.getDocument(req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
  }

  const { errors, sanitized } = validateDocument(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru actualizare.', errors });
  }

  const updated = service.editDocument(req.params.id, sanitized);
  return res.json(updated);
});

router.delete('/:id', requireAuth, function (req, res) {
  const deleted = service.removeDocument(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
  }

  return res.status(204).send();
});

router.post('/upload', requireAuth, function (req, res) {
  const { file, title, category } = req.body || {};
  const errors = {};
  const normalizedFile = typeof file === 'string' ? file.trim() : '';
  const normalizedTitle = typeof title === 'string' ? title.trim() : '';
  const normalizedCategory = typeof category === 'string' ? category.trim() : '';

  if (!normalizedFile) errors.file = 'Fisierul este obligatoriu.';
  if (!normalizedTitle) errors.title = 'Titlul este obligatoriu.';
  if (!normalizedCategory) errors.category = 'Categoria este obligatorie.';

  if (normalizedFile && !normalizedFile.toLowerCase().endsWith('.pdf')) {
    errors.file = 'Doar fisiere PDF sunt acceptate.';
  }

  if (normalizedTitle && (normalizedTitle.length < 3 || normalizedTitle.length > 120)) {
    errors.title = 'Titlul trebuie sa aiba intre 3 si 120 de caractere.';
  }

  if (normalizedCategory && (normalizedCategory.length < 2 || normalizedCategory.length > 60)) {
    errors.category = 'Categoria trebuie sa aiba intre 2 si 60 de caractere.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru upload.', errors });
  }

  const uploaded = service.addUploadedDocument({
    file_path: `/uploads/${normalizedFile.replace(/^.*[\\/]/, '')}`,
    title: normalizedTitle,
    category: normalizedCategory,
    issuer: req.user.email
  });

  return res.status(201).json(uploaded);
});

module.exports = router;

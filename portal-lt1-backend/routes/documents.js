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
  if (!file || !title || !category) {
    return res.status(400).json({ message: 'file, title, category sunt obligatorii.' });
  }

  if (!String(file).toLowerCase().endsWith('.pdf')) {
    return res.status(400).json({ message: 'Doar fisiere PDF sunt acceptate.' });
  }

  const uploaded = service.addUploadedDocument({
    file_path: `/uploads/${String(file).replace(/^.*[\\/]/, '')}`,
    title: String(title).trim(),
    category: String(category).trim(),
    issuer: req.user.email
  });

  return res.status(201).json(uploaded);
});

module.exports = router;

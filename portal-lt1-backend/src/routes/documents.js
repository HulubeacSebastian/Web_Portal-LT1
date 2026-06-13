const express = require('express');
const service = require('../services/documentService');
const { validateDocument, validatePagination } = require('../validation/documentValidation');
const { requireAuth } = require('../middleware/auth');
const { requirePermission } = require('../middleware/permissions');
const hub = require('../realtime/wsHub');

const router = express.Router();

function notifyDocumentsChanged(id, action) {
  hub.broadcast({ type: 'document_changed', id: String(id), action });
}

router.get('/', async function (req, res, next) {
  try {
    const { errors, page, limit } = validatePagination(req.query.page, req.query.limit);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Parametri de paginare invalizi.', errors });
    }

    const result = await service.listDocuments({
      page,
      limit,
      query: req.query.query || '',
      status: req.query.status || ''
    });

    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

router.post('/:id/file', requireAuth, requirePermission('documents:upload'), async function (req, res, next) {
  try {
    const existing = await service.getDocument(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
    }

    const dataUrl = req.body?.dataUrl;
    const name = req.body?.name;
    const type = req.body?.type;

    if (!dataUrl || typeof dataUrl !== 'string') {
      return res.status(400).json({ message: 'Fisierul este obligatoriu (dataUrl).' });
    }

    const updated = await service.attachDocumentFile(String(req.params.id), { dataUrl, name, type });
    notifyDocumentsChanged(req.params.id, 'file');
    return res.json(updated);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
});

router.get('/:id', async function (req, res, next) {
  try {
    const document = await service.getDocument(req.params.id);
    if (!document) {
      return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
    }

    return res.json(document);
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, requirePermission('documents:create'), async function (req, res, next) {
  try {
    const { errors, sanitized } = validateDocument(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru creare.', errors });
    }

    const created = await service.addDocument(sanitized);
    notifyDocumentsChanged(created.id, 'create');
    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAuth, requirePermission('documents:update'), async function (req, res, next) {
  try {
    const existing = await service.getDocument(req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
    }

    const { errors, sanitized } = validateDocument(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru actualizare.', errors });
    }

    const updated = await service.editDocument(req.params.id, sanitized);
    notifyDocumentsChanged(req.params.id, 'update');
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, requirePermission('documents:delete'), async function (req, res, next) {
  try {
    const deleted = await service.removeDocument(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Documentul nu a fost gasit.' });
    }

    notifyDocumentsChanged(req.params.id, 'delete');
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

router.post('/upload', requireAuth, requirePermission('documents:upload'), async function (req, res, next) {
  try {
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

    const uploaded = await service.addUploadedDocument({
      file_path: `/uploads/${normalizedFile.replace(/^.*[\\/]/, '')}`,
      title: normalizedTitle,
      category: normalizedCategory,
      issuer: req.user.email
    });

    return res.status(201).json(uploaded);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

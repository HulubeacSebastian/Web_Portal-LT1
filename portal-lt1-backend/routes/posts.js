const express = require('express');
const store = require('../data/extraStores');
const { requireAuth } = require('../middleware/auth');
const { validatePost } = require('../validation/postValidation');

const router = express.Router();

router.get('/', function (req, res) {
  const posts = store.listPosts(req.query.category || '');
  return res.json(posts);
});

router.post('/', requireAuth, function (req, res) {
  const { errors, sanitized } = validatePost(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru creare.', errors });
  }

  const created = store.createPost({
    ...sanitized,
    author_id: req.user.sub
  });

  return res.status(201).json(created);
});

router.put('/:id', requireAuth, function (req, res) {
  const { errors, sanitized } = validatePost(req.body || {});
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: 'Date invalide pentru actualizare.', errors });
  }

  const updated = store.updatePost(req.params.id, sanitized);
  if (!updated) {
    return res.status(404).json({ message: 'Postarea nu a fost gasita.' });
  }
  return res.json(updated);
});

router.delete('/:id', requireAuth, function (req, res) {
  const deleted = store.deletePost(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Postarea nu a fost gasita.' });
  }
  return res.status(204).send();
});

module.exports = router;

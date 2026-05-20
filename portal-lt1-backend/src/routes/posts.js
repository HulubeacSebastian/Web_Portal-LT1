const express = require('express');
const store = require('../data/extraStores');
const { requireAuth } = require('../middleware/auth');
const { validatePost } = require('../validation/postValidation');

const router = express.Router();

router.get('/', async function (req, res, next) {
  try {
    const posts = await store.listPosts(req.query.category || '');
    return res.json(posts);
  } catch (error) {
    return next(error);
  }
});

router.post('/', requireAuth, async function (req, res, next) {
  try {
    const { errors, sanitized } = validatePost(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru creare.', errors });
    }

    const created = await store.createPost({
      ...sanitized,
      author_id: req.user.sub
    });

    return res.status(201).json(created);
  } catch (error) {
    return next(error);
  }
});

router.put('/:id', requireAuth, async function (req, res, next) {
  try {
    const { errors, sanitized } = validatePost(req.body || {});
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Date invalide pentru actualizare.', errors });
    }

    const updated = await store.updatePost(req.params.id, sanitized);
    if (!updated) {
      return res.status(404).json({ message: 'Postarea nu a fost gasita.' });
    }
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
});

router.delete('/:id', requireAuth, async function (req, res, next) {
  try {
    const deleted = await store.deletePost(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Postarea nu a fost gasita.' });
    }
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

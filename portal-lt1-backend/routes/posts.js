const express = require('express');
const store = require('../data/extraStores');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', function (req, res) {
  const posts = store.listPosts(req.query.category || '');
  return res.json(posts);
});

router.post('/', requireAuth, function (req, res) {
  const { title, content, category_id, image_url } = req.body || {};
  if (!title || !content || !category_id) {
    return res.status(400).json({ message: 'title, content, category_id sunt obligatorii.' });
  }

  const created = store.createPost({
    title: String(title).trim(),
    content: String(content).trim(),
    category_id: String(category_id).trim(),
    image_url: image_url ? String(image_url).trim() : '',
    author_id: req.user.sub
  });

  return res.status(201).json(created);
});

router.put('/:id', requireAuth, function (req, res) {
  const updated = store.updatePost(req.params.id, req.body || {});
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

const express = require('express');
const store = require('../data/extraStores');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, function (req, res) {
  const user = store.getUserById(req.user.sub);
  if (!user) {
    return res.status(404).json({ message: 'Utilizatorul nu a fost gasit.' });
  }

  return res.json({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role
  });
});

module.exports = router;

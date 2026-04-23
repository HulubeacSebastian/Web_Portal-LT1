const express = require('express');
const store = require('../data/extraStores');
const { buildToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', function (req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'email si password sunt obligatorii.' });
  }

  const user = store.getUserByEmail(email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Credentiale invalide.' });
  }

  const token = buildToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    }
  });
});

module.exports = router;

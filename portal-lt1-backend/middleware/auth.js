const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lt1-dev-secret';

function buildToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token lipsa sau invalid.' });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirat sau invalid.' });
  }
}

module.exports = {
  buildToken,
  requireAuth
};

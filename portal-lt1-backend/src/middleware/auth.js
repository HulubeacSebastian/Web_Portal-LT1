const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lt1-dev-secret';
const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m';

function buildAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

/** @deprecated use buildAccessToken — kept for tests referencing buildToken */
function buildToken(user) {
  return buildAccessToken(user);
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Token lipsa sau invalid.' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type && payload.type !== 'access') {
      return res.status(401).json({ message: 'Foloseste token-ul de acces, nu refresh.' });
    }
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token expirat sau invalid.' });
  }
}

module.exports = {
  buildAccessToken,
  buildToken,
  requireAuth,
  JWT_SECRET
};

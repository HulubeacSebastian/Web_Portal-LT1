var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();
var documentsRouter = require('./routes/documents');
var statisticsRouter = require('./routes/statistics');
var authRouter = require('./routes/auth');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var contactRouter = require('./routes/contact');
var documentsGeneratorRouter = require('./routes/documentsGenerator');
var rolesRouter = require('./routes/roles');
var chatRouter = require('./routes/chat');

app.use(logger('dev'));

// CORS: configure ALLOWED_ORIGINS for VM deployment (client must not use localhost).
app.use(function (req, res, next) {
  var origin = req.headers.origin;
  var allowed = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);

  var lanHttpsOrigin =
    origin &&
    process.env.SSL_KEY_PATH &&
    /^https:\/\/(localhost|127\.0\.0\.1|192\.168\.\d{1,3}\.\d{1,3}):5173$/.test(origin);

  if (origin && (allowed.includes(origin) || lanHttpsOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).send();
  }
  return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/health', function (req, res) {
  res.json({ status: 'ok' });
});

app.use('/api/documents', documentsRouter);
app.use('/api/documents/generator', documentsGeneratorRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);
app.use('/api/contact', contactRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/chat', chatRouter);

app.use(function (req, res) {
  res.status(404).json({
    message: 'Resource not found.'
  });
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ message: 'Eroare interna de server.' });
});

module.exports = app;

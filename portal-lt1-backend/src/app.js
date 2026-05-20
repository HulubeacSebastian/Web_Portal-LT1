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

app.use(logger('dev'));

// Basic CORS for local dev (Vite frontend).
app.use(function (req, res, next) {
  var origin = req.headers.origin;
  var allowed = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'];

  if (origin && allowed.includes(origin)) {
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

app.use(function (req, res) {
  res.status(404).json({
    message: 'Resource not found.'
  });
});

module.exports = app;

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

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/health', function (req, res) {
  res.json({ status: 'ok' });
});

app.use('/api/documents', documentsRouter);
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

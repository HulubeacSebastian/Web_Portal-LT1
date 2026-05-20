const express = require('express');
const service = require('../services/documentService');

const router = express.Router();

router.get('/documents', function (req, res) {
  const stats = service.buildStatistics();
  return res.json(stats);
});

module.exports = router;

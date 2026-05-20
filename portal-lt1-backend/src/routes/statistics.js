const express = require('express');
const service = require('../services/documentService');

const router = express.Router();

router.get('/documents', async function (req, res, next) {
  try {
    const stats = await service.buildStatistics();
    return res.json(stats);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;

// routes/log.routes.js

const express = require('express');
const router = express.Router();
const logController = require('../controllers/log.controller');
const authMiddleware = require('../middleware/auth.middleware');

// ✅ Get recent 20 activity logs
router.get('/', authMiddleware, logController.getRecentLogs);

module.exports = router;

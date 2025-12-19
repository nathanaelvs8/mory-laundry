const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Chat endpoint - hanya untuk admin
router.post('/', authMiddleware, adminMiddleware, chat);

module.exports = router;
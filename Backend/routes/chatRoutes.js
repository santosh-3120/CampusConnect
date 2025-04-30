const express = require('express');
const router = express.Router();
const { initiateChat, sendMessage, getChat } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:itemId', authMiddleware, initiateChat);
router.post('/:chatId/message', authMiddleware, sendMessage);
router.get('/:chatId', authMiddleware, getChat);

module.exports = router;
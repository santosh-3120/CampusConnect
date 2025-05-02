const express = require('express');
const router = express.Router();
const { initiateChat, sendMessage, getChats, getChatMessages } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:recipientId', authMiddleware, initiateChat);
router.post('/message/:chatId', authMiddleware, sendMessage);
router.get('/', authMiddleware, getChats);
router.get('/messages/:chatId', authMiddleware, getChatMessages);

module.exports = router;
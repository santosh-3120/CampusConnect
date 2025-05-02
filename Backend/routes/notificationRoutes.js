const express = require('express');
const router = express.Router();
const { createNotification, getNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createNotification);
router.get('/', authMiddleware, getNotifications);

module.exports = router;
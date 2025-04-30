const express = require('express');
const router = express.Router();
const { createNotification } = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createNotification);

module.exports = router;
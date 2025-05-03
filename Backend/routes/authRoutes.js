// routes/authRoutes.js
const express = require('express');
const User = require('../models/User'); // adjust path if necessary

const router = express.Router();
const { login, register, getCurrentUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({
    message: `Welcome to the dashboard, ${req.user.name}!`,
    user: {
      _id: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
      role: req.user.role,
    },
  });
});

router.get('/users', authMiddleware, roleMiddleware(['admin']), async (req, res) => {
  try {
    const users = await User.find({}, '_id name rollNo role').lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
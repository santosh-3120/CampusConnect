const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  try {
    const { name, email, rollNo, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      rollNo,
      password: hashedPassword,
      role: role || 'student', // Default to student if role not provided
    });
    await user.save();
    res.status(201).json({ message: 'User registered', userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: { _id: user._id, name: user.name, rollNo: user.rollNo, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
});

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

module.exports = router;
// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    res.json({
      user: { id: user._id, name: user.name, email: user.email, rollNo: user.rollNo, role: user.role },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, rollNo, password, role } = req.body;
    if (role === 'admin' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Unauthorized to create admin account' });
    }
    const user = new User({ name, email, rollNo, password, role: role || 'student' });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email or roll number already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        rollNo: user.rollNo,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
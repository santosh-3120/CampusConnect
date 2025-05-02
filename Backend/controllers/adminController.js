// controllers/adminController.js
const mongoose = require('mongoose');
const User = require('../models/User');
const LostFoundItem = require('../models/LostFoundItem');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id name email rollNo role').lean();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    if (!['student', 'admin', 'coordinator'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

exports.sendAnnouncement = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ message: 'Announcement message is required' });

    const students = await User.find({ role: 'student' });
    const notification = new Notification({
      message: message.trim(),
      type: 'info',
      recipients: students.map(student => student._id),
    });
    await notification.save();

    const io = req.app.get('io');
    students.forEach(student => {
      io.to(student._id.toString()).emit('notification', notification);
    });

    res.status(201).json({ message: 'Announcement sent', notification });
  } catch (error) {
    res.status(500).json({ message: 'Error sending announcement', error: error.message });
  }
};

exports.getFlaggedPosts = async (req, res) => {
  try {
    const flaggedLostFound = await LostFoundItem.find({ isFlagged: true });
    const flaggedQuestions = await Question.find({ isFlagged: true });
    res.status(200).json({
      lostFound: flaggedLostFound,
      questions: flaggedQuestions,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching flagged posts', error: error.message });
  }
};

exports.resolveFlaggedPost = async (req, res) => {
  try {
    const { postId, type } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ message: 'Invalid post ID' });
    }

    let post;
    if (type === 'lost-found') {
      post = await LostFoundItem.findById(postId);
    } else if (type === 'question') {
      post = await Question.findById(postId);
    } else {
      return res.status(400).json({ message: 'Invalid post type' });
    }

    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.isFlagged = false;
    await post.save();

    res.json({ message: 'Flagged post resolved', post });
  } catch (error) {
    res.status(500).json({ message: 'Error resolving flagged post', error: error.message });
  }
};
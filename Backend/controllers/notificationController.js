const mongoose = require('mongoose');
const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { message, type, relatedId, recipients } = req.body;

    const notification = new Notification({
      message,
      type,
      relatedId: relatedId ? new mongoose.Types.ObjectId(relatedId) : undefined,
      recipients: recipients || [req.user._id],
    });

    await notification.save();

    const io = req.app.get('io');
    notification.recipients.forEach((recipientId) => {
      io.to(recipientId.toString()).emit('notification', notification);
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error: error.message });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipients: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};
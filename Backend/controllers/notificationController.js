const Notification = require('../models/Notification');
const { emitNotification } = require('../utils/socketHandler');

const createNotification = async (req, res) => {
  try {
    const { message, type, relatedId } = req.body;
    
    const notification = new Notification({
      message,
      type,
      relatedId,
      recipients: [], // Empty for broadcast
    });
    
    await notification.save();
    
    emitNotification(notification);
    
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createNotification };
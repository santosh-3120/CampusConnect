const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  type: { type: String, enum: ['info', 'warning', 'error'], default: 'info' },
  relatedId: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFoundItem' },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
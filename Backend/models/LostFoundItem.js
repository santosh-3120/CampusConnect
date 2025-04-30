const mongoose = require('mongoose');

const lostFoundItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true, // Cloudinary URL
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ['lost', 'found'],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  handoverTo: {
    type: String,
    required: true,
    trim: true,
  },
  handoverLocation: {
    type: String,
    required: true,
    trim: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isClaimed: {
    type: Boolean,
    default: false,
  },
  claimant: {
    type: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: String,
      rollNo: String,
    },
    default: null,
  },
  comments: [{
    text: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  isFlagged: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('LostFoundItem', lostFoundItemSchema);
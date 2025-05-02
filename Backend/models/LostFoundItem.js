const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdBy: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
  },
  createdAt: { type: Date, default: Date.now },
});

const lostFoundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  image: { type: String },
  location: { type: String, required: true, trim: true },
  status: { type: String, enum: ['lost', 'found'], required: true },
  date: { type: Date, required: true },
  handoverTo: { type: String, trim: true },
  handoverLocation: { type: String, trim: true },
  createdBy: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rollNo: { type: String, required: true },
  },
  isClaimed: { type: Boolean, default: false },
  claimant: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    rollNo: { type: String },
  },
  comments: [commentSchema],
  isFlagged: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('LostFoundItem', lostFoundItemSchema);
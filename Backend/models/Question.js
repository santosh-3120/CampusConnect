// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      text: { type: String, required: true, trim: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
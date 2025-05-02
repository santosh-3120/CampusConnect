const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  socialLinks: {
    facebook: { type: String },
    x: { type: String },
    instagram: { type: String },
  },
  messages: [
    {
      content: { type: String, required: true },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Club', clubSchema);
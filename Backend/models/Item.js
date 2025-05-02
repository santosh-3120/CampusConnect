const mongoose = require('mongoose');
const { ITEM_CATEGORIES, ITEM_TYPES } = require('../utils/constants');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ITEM_CATEGORIES, required: true },
  type: { type: String, enum: ITEM_TYPES, required: true },
  status: { type: String, enum: ['Available', 'Sold'], default: 'Available' },
  imageUrl: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
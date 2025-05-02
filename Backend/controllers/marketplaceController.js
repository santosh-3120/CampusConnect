// controllers/marketplaceController.js
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Item = require('../models/Item');
const { ITEM_CATEGORIES, ITEM_TYPES } = require('../utils/constants');
const { uploadToCloudinary } = require('../utils/cloudinary');

const validateItem = [
  check('title').notEmpty().withMessage('Title is required').trim(),
  check('description').notEmpty().withMessage('Description is required').trim(),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  check('category').isIn(ITEM_CATEGORIES).withMessage(`Category must be one of: ${ITEM_CATEGORIES.join(', ')}`),
  check('type').isIn(ITEM_TYPES).withMessage(`Type must be one of: ${ITEM_TYPES.join(', ')}`),
];

const createItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Image file is required' });
  }

  const imageUrl = await uploadToCloudinary(req.file.buffer, 'marketplace');

  const { title, description, price, category, type } = req.body;
  const item = new Item({
    title: title.trim(),
    description: description.trim(),
    price: parseFloat(price),
    category,
    type,
    imageUrl,
    user: req.user._id,
  });

  await item.save();
  res.status(201).json({
    success: true,
    message: 'Item created successfully',
    data: item,
  });
});

const getItems = asyncHandler(async (req, res) => {
  const { category, type, status, minPrice, maxPrice, title } = req.query;
  const query = {};

  if (category) query.category = category;
  if (type) query.type = type;
  if (status) query.status = status;
  if (title) {
    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ message: 'Title must be a non-empty string' });
    }
    query.title = { $regex: title.trim(), $options: 'i' };
  }
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) {
      if (isNaN(minPrice) || minPrice < 0) {
        return res.status(400).json({ message: 'minPrice must be a non-negative number' });
      }
      query.price.$gte = parseFloat(minPrice);
    }
    if (maxPrice) {
      if (isNaN(maxPrice) || maxPrice < 0) {
        return res.status(400).json({ message: 'maxPrice must be a non-negative number' });
      }
      query.price.$lte = parseFloat(maxPrice);
    }
  }

  const items = await Item.find(query).populate('user', 'name email rollNo');
  res.status(200).json(items);
});

const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid item ID');
  }
  const item = await Item.findById(id).populate('user', 'name email rollNo');
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  res.status(200).json(item);
});

const updateItem = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this item');
  }

  const { title, description, price, category, type } = req.body;
  item.title = title ? title.trim() : item.title;
  item.description = description ? description.trim() : item.description;
  item.price = price ? parseFloat(price) : item.price;
  item.category = category || item.category;
  item.type = type || item.type;
  if (req.file) {
    item.imageUrl = await uploadToCloudinary(req.file.buffer, 'marketplace');
  }

  await item.save();
  res.status(200).json(item);
});

const markItemAsSold = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }
  if (item.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to mark this item as sold');
  }
  if (item.status === 'Sold') {
    res.status(400);
    throw new Error('Item is already sold');
  }

  item.status = 'Sold';
  await item.save();
  res.status(200).json(item);
});

const getUserItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ user: req.user._id });
  if (!items || items.length === 0) {
    return res.status(404).json({ message: 'No items found for this user' });
  }
  res.status(200).json(items);
});

module.exports = {
  validateItem,
  createItem,
  getItems,
  getItemById,
  updateItem,
  markItemAsSold,
  getUserItems,
};

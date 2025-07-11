const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const Item = require('../models/Item');
const { ITEM_CATEGORIES, ITEM_TYPES } = require('../utils/constants');
const cloudinary = require('../config/cloudinary');
const mongoose = require('mongoose');


// Debug log to verify model
console.log('Item model:', Item);

exports.validateItem = [
  check('title').notEmpty().withMessage('Title is required').trim(),
  check('description').notEmpty().withMessage('Description is required').trim(),
  check('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  check('category').isIn(ITEM_CATEGORIES).withMessage(`Category must be one of: ${ITEM_CATEGORIES.join(', ')}`),
  check('type').isIn(ITEM_TYPES).withMessage(`Type must be one of: ${ITEM_TYPES.join(', ')}`),
];

exports.createItem = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('File:', req.file);
    console.log('User:', req.user);

    const { title, description, price, category, type } = req.body;

    // Validate required fields
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is missing' });
    }

    // Use the Cloudinary URL from multer-storage-cloudinary
    const imageUrl = req.file.path; // This is the Cloudinary secure_url

    // Create new item
    const item = new Item({
      title,
      description,
      price,
      category,
      type,
      imageUrl,
      user: req.user._id, // Use _id instead of id
    });

    console.log('Saving item:', item);
    await item.save();
    console.log('Item saved:', item);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: item,
    });
  } catch (error) {
    console.error('Error creating item:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating item',
      error: error.message,
      stack: error.stack, // Remove in production
    });
  }
};
exports.getItems = asyncHandler(async (req, res) => {
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

exports.getItemById = asyncHandler(async (req, res) => {
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

exports.updateItem = asyncHandler(async (req, res) => {
  console.log('Update item request body:', req.body, 'File:', req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
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
  item.title = title || item.title;
  item.description = description || item.description;
  item.price = price ? parseFloat(price) : item.price;
  item.category = category || item.category;
  item.type = type || item.type;
  if (req.file) item.imageUrl = req.file.path;

  await item.save();
  res.status(200).json(item);
});

exports.markItemAsSold = asyncHandler(async (req, res) => {

  console.log(req.params.id);
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

exports.getUserItems =asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id; // Get the user ID from the authenticated user
    
    // Fetch items where the userId matches
    const items = await Item.find({ user: userId });

    if (!items || items.length === 0) {
      return res.status(404).json({ message: "No items found for this user." });
    }

    res.status(200).json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});
// module.exports = {
//   validateItem,
//   createItem,
//   getItems,
//   getItemById,
//   updateItem,
//   markItemAsSold,
//   getUserItems, // ✅ Add this line
// };


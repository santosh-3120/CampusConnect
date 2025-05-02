const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const {
  validateItem,
  createItem,
  getItems,
  getItemById,
  updateItem,
  markItemAsSold,
  getUserItems,
} = require('../controllers/marketplaceController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const Item = require('../models/Item'); // ✅ Import the Item model

// ✅ Place this route before the dynamic /:id route
router.get('/dashboard/my-items', authMiddleware, getUserItems);

router.post('/items', authMiddleware, upload.single('image'), createItem);

// Get all items
router.get('/', getItems);

// Get item by ID
router.get('/:id', getItemById);

// Update item by ID
router.put('/:id', authMiddleware, upload.single('image'), validateItem, updateItem);

// Mark item as sold
router.patch('/:id/sold', authMiddleware, markItemAsSold);

module.exports = router;
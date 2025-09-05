const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const LostFoundItem = require('../models/LostFoundItem');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/cloudinary');

// Validation middleware for updating Lost and Found items
exports.validateLostFoundItem = [
  check('itemName').optional().notEmpty().withMessage('Item name cannot be empty').trim(),
  check('description').optional().notEmpty().withMessage('Description cannot be empty').trim(),
  check('location').optional().notEmpty().withMessage('Location cannot be empty').trim(),
  check('status').optional().isIn(['lost', 'found']).withMessage('Status must be either "lost" or "found"'),
  check('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 format'),
  check('handoverTo').optional().trim(),
  check('handoverLocation').optional().trim(),
];

exports.createLostFoundItem = async (req, res) => {
  try {
    const { itemName, description, location, status, date, handoverTo, handoverLocation } = req.body;

    // Check for required fields
    if (!itemName || !description || !location || !status || !date) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Ensure fields are strings before calling trim (if they are arrays, we handle accordingly)
    const itemNameTrimmed = typeof itemName === 'string' ? itemName.trim() : itemName;
    const descriptionTrimmed = Array.isArray(description) ? description[0].trim() : (typeof description === 'string' ? description.trim() : description);
    const locationTrimmed = Array.isArray(location) ? location[0].trim() : (typeof location === 'string' ? location.trim() : location);
    const handoverToTrimmed = Array.isArray(handoverTo) ? handoverTo[0].trim() : (typeof handoverTo === 'string' ? handoverTo.trim() : handoverTo);
    const handoverLocationTrimmed = Array.isArray(handoverLocation) ? handoverLocation[0].trim() : (typeof handoverLocation === 'string' ? handoverLocation.trim() : handoverLocation);
    const statusTrimmed = Array.isArray(status) ? status[0].trim() : (typeof status === 'string' ? status.trim() : status);

    // Handle date input as an array and ensure it's a string
    const dateString = Array.isArray(date) ? date[0].trim() : date.trim();

    // Debugging the date input
    console.log('Received date:', dateString);

    // Handle date parsing and validation
    const parsedDate = new Date(dateString);
    console.log('Parsed date:', parsedDate); // Debugging parsed date

    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Please use ISO 8601 format (e.g., "2025-05-01T10:00:00Z")' });
    }

    // Handle file upload (if any)
    let imageUrl = '';
    if (req.file) {
      // imageUrl = await uploadToCloudinary(req.file.buffer, 'lost-found');
      imageUrl = req.file.path;
      console.log('Uploaded image URL:', imageUrl);
    }

    // Create the lost found item
    const item = new LostFoundItem({
      itemName: itemNameTrimmed,
      description: descriptionTrimmed,
      image: imageUrl,
      location: locationTrimmed,
      status: statusTrimmed,
      date: parsedDate,
      handoverTo: handoverToTrimmed,
      handoverLocation: handoverLocationTrimmed,
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
        rollNo: req.user.rollNo,
      },
    });

    await item.save();

    // Send notification about the new item
    const notification = new Notification({
      message: `New ${statusTrimmed} item posted: ${itemNameTrimmed}`,
      type: 'info',
      relatedId: item._id,
      recipients: [], // Add specific recipients if necessary
    });
    await notification.save();

    // Emit notification to connected clients
    const io = req.app.get('io');
    io.emit('notification', notification);

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error: error.message });
  }
};

exports.getLostFoundItems = async (req, res) => {
  try {
    const { status, sort } = req.query;
    const query = status ? { status } : {};
    const sortOption = sort === 'recent' ? { createdAt: -1 } : {};
    const items = await LostFoundItem.find(query).sort(sortOption);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
};

exports.getLostFoundItem = async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error: error.message });
  }
};

exports.updateLostFoundItem = asyncHandler(async (req, res) => {
  console.log('Update item request body:', req.body, 'File:', req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const item = await LostFoundItem.findById(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  if (item.createdBy._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this item');
  }

  const { itemName, description, location, status, date, handoverTo, handoverLocation } = req.body;

  item.itemName = itemName ? itemName.trim() : item.itemName;
  item.description = description ? description.trim() : item.description;
  item.location = location ? location.trim() : item.location;
  item.status = status || item.status;
  item.date = date ? new Date(date) : item.date;
  item.handoverTo = handoverTo ? handoverTo.trim() : item.handoverTo;
  item.handoverLocation = handoverLocation ? handoverLocation.trim() : item.handoverLocation;
  if (req.file) {
    item.image = req.file.path; // Use Cloudinary path
    console.log('Updated image URL:', item.image);
  }

  await item.save();
  console.log('✅ Item updated:', item);

  // Send notification about the updated item
  const notification = new Notification({
    message: `Item updated: ${item.itemName}`,
    type: 'info',
    relatedId: item._id,
    recipients: [], // Add specific recipients if necessary
  });
  await notification.save();

  const io = req.app.get('io');
  io.emit('notification', notification);

  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: item,
  });
});

exports.deleteLostFoundItem = async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if user is creator or admin
    if (req.user._id.toString() !== item.createdBy._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized to delete this item' });
    }

    await LostFoundItem.findByIdAndDelete(req.params.id);

    // Optionally, delete related notifications
    await Notification.deleteMany({ relatedId: req.params.id });

    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.comments.push({
      text: text.trim(),
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
      },
    });

    await item.save();

    const notification = new Notification({
      message: `${req.user.name} commented on ${item.itemName}`,
      type: 'info',
      relatedId: item._id,
      recipients: [item.createdBy._id],
    });
    await notification.save();

    const io = req.app.get('io');
    io.to(item.createdBy._id.toString()).emit('notification', notification);

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.claimLostFoundItem = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.isClaimed) return res.status(400).json({ message: 'Item already claimed' });

    // Mark as claimed
    item.isClaimed = true;
    item.claimant = {
      userId: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
    };

    await item.save();

    // Notification
    const notification = new Notification({
      message: `${req.user.name} claimed ${item.itemName}`,
      type: 'info',
      relatedId: item._id,
      recipients: item.createdBy?._id ? [item.createdBy._id] : [],
    });
    await notification.save();

    const io = req.app.get('io');
    if (io && item.createdBy?._id) {
      io.to(item.createdBy._id.toString()).emit('notification', notification);
    }

    res.status(200).json(item);
  } catch (error) {
    console.error('Claim item error:', error);
    res.status(500).json({ message: 'Error claiming item', error: error.message });
  }
};

exports.flagLostFoundItem = async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.isFlagged) return res.status(400).json({ message: 'Item already flagged' });

    item.isFlagged = true;
    await item.save();

    const notification = new Notification({
      message: `${item.itemName} has been flagged`,
      type: 'warning',
      relatedId: item._id,
      recipients: [], // Add admin IDs if needed
    });
    await notification.save();

    constισ = req.app.get('io');
    io.emit('notification', notification);

    res.status(200).json({ message: 'Post flagged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error flagging item', error: error.message });
  }
};
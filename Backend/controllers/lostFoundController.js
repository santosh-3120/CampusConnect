// controllers/lostFoundController.js
const LostFoundItem = require('../models/LostFoundItem');
const Notification = require('../models/Notification');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.createLostFoundItem = async (req, res) => {
  try {
    const { itemName, description, location, status, date, handoverTo, handoverLocation } = req.body;
    if (!itemName || !description || !location || !status || !date) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'lost-found');
    }

    const item = new LostFoundItem({
      itemName: itemName.trim(),
      description: description.trim(),
      image: imageUrl,
      location: location.trim(),
      status,
      date: parsedDate,
      handoverTo: handoverTo ? handoverTo.trim() : '',
      handoverLocation: handoverLocation ? handoverLocation.trim() : '',
      createdBy: {
        _id: req.user._id,
        name: req.user.name,
        rollNo: req.user.rollNo,
      },
    });

    await item.save();

    const notification = new Notification({
      message: `New ${status} item posted: ${itemName}`,
      type: 'info',
      relatedId: item._id,
      recipients: [],
    });
    await notification.save();

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

exports.claimLostFoundItem = async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.isClaimed) return res.status(400).json({ message: 'Item already claimed' });

    item.isClaimed = true;
    item.claimant = {
      userId: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
    };

    await item.save();

    const notification = new Notification({
      message: `${req.user.name} claimed ${item.itemName}`,
      type: 'info',
      relatedId: item._id,
      recipients: [item.createdBy._id],
    });
    await notification.save();

    const io = req.app.get('io');
    io.to(item.createdBy._id.toString()).emit('notification', notification);

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error claiming item', error: error.message });
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

    const io = req.app.get('io');
    io.emit('notification', notification);

    res.status(200).json({ message: 'Post flagged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error flagging item', error: error.message });
  }
};
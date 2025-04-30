const LostFoundItem = require('../models/LostFoundItem');
const { uploadToCloudinary } = require('../utils/cloudinary');
const { emitNewLostFoundPost } = require('../utils/socketHandler');

const getAllPosts = async (req, res) => {
  try {
    const { status, sort } = req.query;
    let query = {};
    if (status) query.status = status;
    
    const posts = await LostFoundItem.find(query)
      .populate('createdBy', 'name rollNo')
      .populate('claimant.userId', 'name rollNo')
      .sort(sort === 'recent' ? '-createdAt' : 'createdAt');
    
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { itemName, description, location, status, date, handoverTo, handoverLocation } = req.body;
    const image = req.file;

    if (!image) return res.status(400).json({ message: 'Image is required' });

    const imageUrl = await uploadToCloudinary(image.buffer);
    
    const post = new LostFoundItem({
      itemName,
      description,
      image: imageUrl,
      location,
      status,
      date,
      handoverTo,
      handoverLocation,
      createdBy: req.user._id,
    });

    await post.save();
    
    const populatedPost = await LostFoundItem.findById(post._id)
      .populate('createdBy', 'name rollNo');
    
    emitNewLostFoundPost(populatedPost);
    
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await LostFoundItem.findById(req.params.id)
      .populate('createdBy', 'name rollNo')
      .populate('claimant.userId', 'name rollNo')
      .populate('comments.createdBy', 'name');
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const claimPost = async (req, res) => {
  try {
    const post = await LostFoundItem.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.isClaimed) return res.status(400).json({ message: 'Item already claimed' });
    
    post.isClaimed = true;
    post.claimant = {
      userId: req.user._id,
      name: req.user.name,
      rollNo: req.user.rollNo,
    };
    
    await post.save();
    
    const populatedPost = await LostFoundItem.findById(post._id)
      .populate('createdBy', 'name rollNo')
      .populate('claimant.userId', 'name rollNo');
    
    res.status(200).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await LostFoundItem.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.comments.push({
      text,
      createdBy: req.user._id,
    });
    
    await post.save();
    
    const updatedPost = await LostFoundItem.findById(post._id)
      .populate('comments.createdBy', 'name');
    
    res.status(201).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const flagPost = async (req, res) => {
  try {
    const post = await LostFoundItem.findById(req.params.id);
    
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    post.isFlagged = true;
    await post.save();
    
    res.status(200).json({ message: 'Post flagged successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllPosts,
  createPost,
  getPostById,
  claimPost,
  addComment,
  flagPost,
};
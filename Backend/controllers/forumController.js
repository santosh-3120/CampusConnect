// controllers/forumController.js
const mongoose = require('mongoose');
const Question = require('../models/Question');
const Notification = require('../models/Notification');

exports.createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const question = new Question({
      title: title.trim(),
      content: content.trim(),
      category: category.trim(),
      author: req.user._id,
    });

    await question.save();

    const notification = new Notification({
      message: `New question posted: ${title}`,
      type: 'info',
      relatedId: question._id,
      recipients: [],
    });
    await notification.save();

    const io = req.app.get('io');
    io.emit('notification', notification);

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { category, sort } = req.query;
    const query = category ? { category } : {};
    const sortOption = sort === 'recent' ? { createdAt: -1 } : sort === 'upvotes' ? { upvotes: -1 } : {};
    const questions = await Question.find(query)
      .populate('author', 'name rollNo')
      .sort(sortOption);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await Question.findById(id)
      .populate('author', 'name rollNo')
      .populate('comments.author', 'name rollNo');
    if (!question) return res.status(404).json({ message: 'Question not found' });

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    question.comments.push({
      text: text.trim(),
      author: req.user._id,
    });

    await question.save();

    const notification = new Notification({
      message: `${req.user.name} commented on "${question.title}"`,
      type: 'info',
      relatedId: question._id,
      recipients: [question.author],
    });
    await notification.save();

    const io = req.app.get('io');
    io.to(question.author.toString()).emit('notification', notification);

    const updatedQuestion = await Question.findById(id)
      .populate('author', 'name rollNo')
      .populate('comments.author', 'name rollNo');
    res.status(201).json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};

exports.upvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const userIndex = question.upvotes.indexOf(req.user._id);
    let upvoted = false;

    if (userIndex === -1) {
      question.upvotes.push(req.user._id);
      upvoted = true;
    } else {
      question.upvotes.splice(userIndex, 1);
    }

    await question.save();
    res.status(200).json({ upvoted, upvoteCount: question.upvotes.length });
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting question', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid question ID' });
    }

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    if (question.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await question.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
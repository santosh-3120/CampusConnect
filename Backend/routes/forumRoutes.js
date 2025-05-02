// routes/forumRoutes.js
const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestion,
  addComment,
  upvoteQuestion,
  deleteQuestion,
} = require('../controllers/forumController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/', authMiddleware, createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestion);
router.post('/:id/comments', authMiddleware, addComment);
router.post('/:id/upvote', authMiddleware, upvoteQuestion);
router.delete('/:id', authMiddleware, deleteQuestion);

module.exports = router;
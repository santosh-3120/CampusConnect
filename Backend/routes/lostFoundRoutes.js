const express = require('express');
const router = express.Router();
const { getAllPosts, createPost, getPostById, claimPost, addComment, flagPost } = require('../controllers/lostFoundController');
const authMiddleware = require('../middleware/authMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

router.get('/', getAllPosts);
router.post('/', authMiddleware, uploadMiddleware.single('image'), createPost);
router.get('/:id', getPostById);
router.post('/:id/claim', authMiddleware, claimPost);
router.post('/:id/comment', authMiddleware, addComment);
router.post('/:id/flag', authMiddleware, flagPost);

module.exports = router;
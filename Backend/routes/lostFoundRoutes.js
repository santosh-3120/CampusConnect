const express = require('express');
const router = express.Router();
const {
  createLostFoundItem,
  getLostFoundItems,
  getLostFoundItem,
  claimLostFoundItem,
  updateLostFoundItem,
  deleteLostFoundItem,
  addComment,
  flagLostFoundItem,
} = require('../controllers/lostFoundController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('image'), createLostFoundItem);
router.get('/', getLostFoundItems);
router.get('/:id', getLostFoundItem);
router.put('/:id', authMiddleware, upload.single('image'), updateLostFoundItem);
router.delete('/:id', authMiddleware, deleteLostFoundItem);
router.post('/:id/claim', authMiddleware, claimLostFoundItem);
router.post('/:id/comment', authMiddleware, addComment);
router.post('/:id/flag', authMiddleware, flagLostFoundItem);

module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs,
  getClub,
  updateClub,
  deleteClub,
  followClub,
  unfollowClub,
  getClubMessages,
  postClubMessage,
  deleteClubMessage,
  getClubFollowers,
  removeClubFollower
} = require('../controllers/clubController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// Admin-only routes
router.post('/', authMiddleware, roleMiddleware(['admin']), uploadMiddleware.single('logo'), createClub);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), uploadMiddleware.single('logo'), updateClub);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteClub);

// Public routes (view clubs)
router.get('/', getClubs);
router.get('/:id', getClub);

// Student-only routes (follow/unfollow)
router.post('/:id/follow', authMiddleware, roleMiddleware(['student']), followClub);
router.post('/:id/unfollow', authMiddleware, roleMiddleware(['student']), unfollowClub);

// Authenticated routes (messages)
router.get('/:id/messages', authMiddleware, getClubMessages);
router.post('/:id/messages', authMiddleware, roleMiddleware(['admin']), postClubMessage);
router.delete('/:clubId/messages/:messageId', authMiddleware, roleMiddleware(['admin', 'coordinator']), deleteClubMessage);


// Route to fetch follower names
// Add this below the follow/unfollow routes
router.get('/:id/followers', authMiddleware, getClubFollowers); // Public

// Admin-only route to remove a follower
router.delete('/:clubId/followers/:userId', authMiddleware, roleMiddleware(['admin']), removeClubFollower);

module.exports = router;
// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getUsers,
  updateUserRole,
  deleteUser,
  sendAnnouncement,
  getFlaggedPosts,
  resolveFlaggedPost,
} = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/users', authMiddleware, roleMiddleware(['admin']), getUsers);
router.put('/users/:userId/role', authMiddleware, roleMiddleware(['admin']), updateUserRole);
router.delete('/users/:userId', authMiddleware, roleMiddleware(['admin']), deleteUser);
router.post('/announcements', authMiddleware, roleMiddleware(['admin']), sendAnnouncement);
router.get('/flagged-posts', authMiddleware, roleMiddleware(['admin']), getFlaggedPosts);
router.put('/flagged-posts/:type/:postId', authMiddleware, roleMiddleware(['admin']), resolveFlaggedPost);

module.exports = router;
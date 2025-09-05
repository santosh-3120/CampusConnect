// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  rsvpEvent,
  addComment,
  toggleLike,
} = require("../controllers/eventController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware"); // Updated import

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("image"),
  createEvent
);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  upload.single("image"),
  updateEvent
);
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteEvent);
router.get("/", authMiddleware, getAllEvents);
router.get("/:id", authMiddleware, getEventById);
router.post(
  "/:id/rsvp",
  authMiddleware,
  roleMiddleware(["student"]),
  rsvpEvent
);
router.post(
  "/:id/comments",
  authMiddleware,
  upload.single("image"),
  addComment
);
router.post("/:id/like", authMiddleware, toggleLike);

module.exports = router;

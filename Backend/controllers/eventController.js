// controllers/eventController.js
const mongoose = require('mongoose');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');
const { uploadToCloudinary } = require('../utils/cloudinary');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    if (!title || !description || !date || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'events');
    }

    const event = new Event({
      title: title.trim(),
      description: description.trim(),
      date,
      location: location.trim(),
      image: imageUrl,
      creator: req.user._id,
    });

    await event.save();

    const students = await User.find({ role: 'student' });
    const emailPromises = students.map(student =>
      sendEmail(
        student.email,
        'New Event Created',
        `A new event "${title}" has been scheduled on ${new Date(date).toLocaleString()}.`
      )
    );
    await Promise.all(emailPromises);

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, date, location } = req.body;
    if (title) event.title = title.trim();
    if (description) event.description = description.trim();
    if (date) event.date = date;
    if (location) event.location = location.trim();
    if (req.file) {
      event.image = await uploadToCloudinary(req.file.buffer, 'events');
    }

    await event.save();

    const students = await User.find({ role: 'student' });
    const emailPromises = students.map(student =>
      sendEmail(
        student.email,
        'Event Updated',
        `The event "${event.title}" has been updated to ${new Date(event.date).toLocaleString()}.`
      )
    );
    await Promise.all(emailPromises);

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('creator', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id)
      .populate('creator', 'name email')
      .populate('rsvps', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.rsvpEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.rsvps.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already RSVP\'d' });
    }

    event.rsvps.push(req.user._id);
    await event.save();

    res.json({ message: 'RSVP successful', event });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required' });

    let imageUrl = '';
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer, 'event-comments');
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.comments.push({ userId: req.user._id, text: text.trim(), image: imageUrl });
    await event.save();

    const updatedEvent = await Event.findById(id).populate('comments.userId', 'name profileImage');
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const event = await Event.findById(id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const userIndex = event.likes.indexOf(req.user._id);
    let liked = false;

    if (userIndex === -1) {
      event.likes.push(req.user._id);
      liked = true;
    } else {
      event.likes.splice(userIndex, 1);
    }

    await event.save();
    res.status(200).json({ liked, likeCount: event.likes.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle like', error: error.message });
  }
};
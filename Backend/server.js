// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./config/socket');

// Load env variables
dotenv.config();

// Route Imports
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const clubRoutes = require('./routes/clubRoutes');
const chatRoutes = require('./routes/chatRoutes');
const lostFoundRoutes = require('./routes/lostFoundRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const forumRoutes = require('./routes/forumRoutes'); // Placeholder
const adminRoutes = require('./routes/adminRoutes'); // Placeholder

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Initialize Socket.IO
initSocket(server);

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set('io', require('./config/socket').getIO());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clubs', clubRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/forum', forumRoutes); // Placeholder
app.use('/api/admin', adminRoutes); // Placeholder

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
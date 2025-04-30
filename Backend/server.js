require('dotenv').config(); // Load .env variables
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
 // MongoDB connection function

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Root route for testing
app.get('/', (req, res) => {
  res.send('Backend connected successfully');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

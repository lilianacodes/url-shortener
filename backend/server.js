// Import dependencies
const express = require('express');       // Framework for creating the server
const mongoose = require('mongoose');     // ODM for MongoDB
const cors = require('cors');             // Enable CORS requests
require('dotenv').config();               // Load environment variables from .env

const urlRoutes = require('./routes/url'); // Import routes for URL handling

const app = express();                     // Create Express app

// Middleware
app.use(cors());                           // Allow cross-origin requests
app.use(express.json());                   // Parse JSON in request body

// Log MONGO_URI for debugging
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Root test route
app.get('/', (req, res) => {
  res.send('URL Shortener API is running');
});

// Use URL routes for API endpoints
app.use('/', urlRoutes);

// Start server on the port from .env or 5000 by default
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
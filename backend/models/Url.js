const mongoose = require('mongoose');

// Schema for storing URLs
const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },       // Original URL
  shortCode: { type: String, required: true, unique: true }, // Unique short code
  date: { type: Date, default: Date.now }         // Date of creation
});

module.exports = mongoose.model('Url', urlSchema); // Export the model



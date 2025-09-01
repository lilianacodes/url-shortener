const express = require('express');
const shortid = require('shortid');        // Generate unique short codes
const Url = require('../models/Url');      // MongoDB model for URL

const router = express.Router();

// Create a new short URL
router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;            // Get original URL from request
  const shortCode = shortid.generate();    // Generate unique short code

  try {
    // Check if URL already exists in the database
    let url = await Url.findOne({ longUrl });
    if (url) return res.json(url);         // If exists, return existing URL

    // If not, create a new document in MongoDB
    url = new Url({ longUrl, shortCode });
    await url.save();

    res.json(url);                         // Return the newly created URL
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');  // Server error
  }
});

// Redirect using the short code
router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (url) return res.redirect(url.longUrl);  // Redirect to original URL
    return res.status(404).json('URL not found'); // 404 if not found
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');       // Server error
  }
});

module.exports = router;  // Export routes




import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());                 // Allow cross-origin requests
app.use(express.json());         // Parse JSON in request body

// MongoDB connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema and model
const urlSchema = new mongoose.Schema({
  longUrl: { type: String, required: true },
  shortCode: { type: String, required: true, unique: true }
});

const Url = mongoose.model('Url', urlSchema);

// API endpoint to shorten URL
app.post('/api/shorten', async (req, res) => {
  const { longUrl } = req.body;
  console.log('Received longUrl:', longUrl);

  try {
    // Generate a unique short code
    const shortCode = nanoid(6);

    // Create new document
    const newUrl = new Url({
      longUrl,
      shortCode
    });

    await newUrl.save();

    res.json({ shortId: shortCode });
  } catch (error) {
    console.error('Error saving URL:', error);
    res.status(500).json({ error: 'Failed to shorten URL' });
  }
});

// Optional: redirect endpoint
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortCode });
    if (urlDoc) {
      return res.redirect(urlDoc.longUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error fetching URL:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



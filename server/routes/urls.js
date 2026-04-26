const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const Url = require('../models/Url');
const auth = require('../middleware/auth');

// SHORTEN URL
router.post('/shorten', auth, async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const shortCode = nanoid(6);

    const url = await Url.create({
      user: req.userId,
      originalUrl,
      shortCode,
      clicks: []
    });

    res.status(201).json(url);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET MY URLS
router.get('/my-urls', auth, async (req, res) => {
  try {
    const urls = await Url.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(urls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});


// GET AI INSIGHT FOR A URL
router.get('/:id/insight', auth, async (req, res) => {
  try {
    const url = await Url.findById(req.params.id);
    if (!url) return res.status(404).json({ message: 'URL not found' });

    const totalClicks = url.clicks.length;
    const analyticsText = `This URL has been clicked ${totalClicks} times. Clicks over time: ${url.clicks.map(c => new Date(c.timestamp).toLocaleString()).join(', ')}`;

   const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
  },
  body: JSON.stringify({
model: 'inclusionai/ling-2.6-1t:free',
    messages: [{
      role: 'user',
      content: `You are an analytics assistant. Given this data about a shortened URL, write a short 2-3 sentence insight: ${analyticsText}`
    }]
  })
});

const data = await response.json();
console.log('OpenRouter response:', JSON.stringify(data, null, 2));
const insight = data.choices?.[0]?.message?.content || 'No insight available';

    res.json({ insight, totalClicks });
  } catch (err) {
    console.error('Insight error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
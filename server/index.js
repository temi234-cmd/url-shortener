const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const Url = require('./models/Url');
const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes (we'll add these soon)
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/urls');

app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);

// REDIRECT ROUTE
app.get('/:shortCode', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.shortCode });
    if (!url) return res.status(404).json({ message: 'URL not found' });

    url.clicks.push({
      timestamp: new Date(),
      source: req.headers.referer || 'direct'
    });
    await url.save();

    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error(err));
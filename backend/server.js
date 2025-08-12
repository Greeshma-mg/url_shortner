const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

const urlRoutes = require('./routes/url');

app.use('/api/url', urlRoutes);

app.get('/api/debug/urls', async (req, res) => {
  try {
    const Url = require('./models/Url');
    const allUrls = await Url.find({}).sort({ createdAt: -1 }).limit(20);
    res.json({
      total: allUrls.length,
      urls: allUrls.map(url => ({
        shortCode: url.shortCode,
        longUrl: url.longUrl,
        clicks: url.clicks,
        createdAt: url.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, 'frontend', 'build')));

app.get('/:code([A-Za-z0-9_-]+)', async (req, res) => {
  console.log('=== EXPLICIT REDIRECT ROUTE ===');
  console.log('Requested code:', req.params.code);
  
  const Url = require('./models/Url');
  
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    console.log('Database search result:', url);
    
    if (!url) {
      console.log('No URL found for code:', req.params.code);
      
      const allUrls = await Url.find({}, { shortCode: 1, longUrl: 1 }).limit(10);
      console.log('Available codes in database:', allUrls);
      
      return res.status(404).json({ error: 'No URL found' });
    }
    
    console.log('Found URL, redirecting to:', url.longUrl);
    url.clicks++;
    await url.save();
    
    return res.redirect(url.longUrl);
  } catch (err) {
    console.error('Error in redirect:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});
app.get('*', (req, res) => {
  console.log('Catch-all route triggered for:', req.url);
  res.sendFile(path.join(__dirname1, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
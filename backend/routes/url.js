// @ts-nocheck
const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Url = require('../models/Url');

router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  
  console.log('=== SHORTEN REQUEST ===');
  console.log('Received longUrl:', longUrl);
  console.log('BASE_URL:', process.env.BASE_URL);

  if (!validUrl.isUri(longUrl)) {
    console.log('Invalid URL detected');
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = nanoid(7);
  const shortUrl = `${process.env.BASE_URL}/${code}`;
  
  console.log('Generated code:', code);
  console.log('Generated shortUrl:', shortUrl);

  try {
    // Check if URL already exists
    let url = await Url.findOne({ longUrl });
    console.log('Existing URL check result:', url);
    
    if (url) {
      console.log('URL already exists, returning existing');
      return res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
    }

    // Create new URL entry
    console.log('Creating new URL entry...');
    url = new Url({ longUrl, shortCode: code });
    console.log('URL object before save:', url);
    
    await url.save();
    console.log('URL saved successfully!');
    console.log('Saved URL object:', url);

    res.json({ shortUrl, code });
  } catch (err) {
    console.error('Error in /shorten:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const requestedCode = req.params.code;
    console.log('=== REDIRECT REQUEST ===');
    console.log('Requested code:', requestedCode);
    
    const url = await Url.findOne({ shortCode: requestedCode });
    console.log('Database search result:', url);
    
    if (!url) {
      console.log('No URL found for code:', requestedCode);
      
      // Let's also check what codes DO exist in the database
      const allUrls = await Url.find({}, { shortCode: 1, longUrl: 1 }).limit(5);
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

module.exports = router;
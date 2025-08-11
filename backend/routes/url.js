// @ts-nocheck


const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const validUrl = require('valid-url');
const Url = require('../models/Url');

router.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;

  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  const code = nanoid(7);
  const shortUrl = `${process.env.BASE_URL}/${code}`;

  try {
    let url = await Url.findOne({ longUrl });
    if (url) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/${url.shortCode}` });
    }

    url = new Url({ longUrl, shortCode: code });
    await url.save();

    res.json({ shortUrl, code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) {
      return res.status(404).json({ error: 'No URL found' });
    }
    url.clicks++;
    await url.save();
    return res.redirect(url.longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;

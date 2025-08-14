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
app.use('/api/url', require('./routes/url'));
app.use('/', require('./routes/url')); 
const __dirnamePath = path.resolve();
app.use(express.static(path.join(__dirnamePath, 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirnamePath, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

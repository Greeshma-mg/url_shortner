const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); 

dotenv.config();

const app = express();
app.use(express.json());
connectDB();
app.use('/api/url', require('./routes/url')); 
const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname1, 'frontend', 'build', 'index.html'));
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

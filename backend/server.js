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

const urlRoutes = require('./routes/url');
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${new Date().toISOString()}`);
  next();
});

app.use('/api/url', urlRoutes);


app.use('/', (req, res, next) => {
  console.log('Checking redirect route for:', req.path);
  console.log('Request params would be:', req.params);
  next();
}, urlRoutes);

const __dirname1 = path.resolve();
app.use(express.static(path.join(__dirname1, 'frontend', 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname1, 'frontend', 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
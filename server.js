require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.error('MongoDB connection error:', err)); // Added more specific error for debugging

// Middleware

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // This line serves your frontend files
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Blog API is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
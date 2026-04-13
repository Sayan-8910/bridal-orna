// =============================================
// server.js - Main Express Server Entry Point
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const dns = require('dns');

// Load environment variables from .env file
dotenv.config();

// Render can return IPv6 first; force IPv4 to avoid SMTP ENETUNREACH for Gmail.
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (err) {
  console.log('DNS result order setup skipped:', err?.message || err);
}

const app = express();

// ---- Middleware ----
app.use(cors()); // Allow cross-origin requests (React frontend)
app.use(express.json()); // Parse incoming JSON requests
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// ---- Routes ----
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

// ---- Health Check ----
app.get('/', (req, res) => {
  res.json({ message: 'Bridal Orna API is running!' });
});

// ---- Connect to MongoDB & Start Server ----
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bridal-orna';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

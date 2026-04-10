// =============================================
// scripts/createAdmin.js
// Run: node scripts/createAdmin.js
// Creates the initial admin account
// =============================================

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bridal-orna';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bridalorna.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      if (existing.role === 'admin') {
        console.log('ℹ️  Admin already exists:', ADMIN_EMAIL);
        process.exit(0);
      } else {
        existing.role = 'admin';
        await existing.save();
        console.log('✅ Upgraded user to admin:', ADMIN_EMAIL);
        process.exit(0);
      }
    }

    // Create admin user
    await User.create({
      name: 'Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });

    console.log('');
    console.log('🎉 Admin account created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Email   :', ADMIN_EMAIL);
    console.log('  Password:', ADMIN_PASSWORD);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('You can now login at http://localhost:3000/login');
    console.log('');
  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();

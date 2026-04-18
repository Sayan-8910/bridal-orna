// =============================================
// routes/auth.js - Authentication Routes
// Includes: Register, Login, Forgot Password
// =============================================

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const dns = require('dns').promises;
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// In-memory OTP store: { email: { otp, expiresAt } }
const otpStore = {};

// Helper: Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Helper: Send email via Resend (preferred) or Gmail SMTP fallback
const sendEmail = async (to, subject, html) => {
  const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
  const resendFromEmail = (process.env.RESEND_FROM_EMAIL || '').trim();
  const emailUser = (process.env.EMAIL_USER || '').trim();
  const emailPass = (process.env.EMAIL_PASS || '').trim();

  let resendError = null;
  if (resendApiKey && resendFromEmail) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `Bridal Orna <${resendFromEmail}>`,
          to: [to],
          subject,
          html,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Resend API ${response.status}: ${errText}`);
      }

      return;
    } catch (error) {
      resendError = error;
      console.log('Resend send failed, falling back to SMTP:', error?.message || error);
    }
  }

  if (!emailUser || !emailPass) {
    throw new Error(
      resendError
        ? `Email failed. Resend error: ${resendError.message}. SMTP credentials missing (EMAIL_USER/EMAIL_PASS).`
        : 'SMTP credentials missing. Set EMAIL_USER and EMAIL_PASS in backend/.env'
    );
  }

  let smtpHost = 'smtp.gmail.com';
  try {
    const ipv4Records = await dns.resolve4('smtp.gmail.com');
    if (Array.isArray(ipv4Records) && ipv4Records.length > 0) {
      smtpHost = ipv4Records[0];
    }
  } catch (dnsErr) {
    console.log('SMTP DNS IPv4 lookup failed, using hostname:', dnsErr?.message || dnsErr);
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: 587,
    secure: false,
    requireTLS: true,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      servername: 'smtp.gmail.com',
    },
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  let smtpLastError = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await transporter.sendMail({
        from: `"Bridal Orna" <${emailUser}>`,
        to,
        subject,
        html,
      });
      return;
    } catch (smtpErr) {
      smtpLastError = smtpErr;
      console.log(`SMTP send attempt ${attempt} failed:`, smtpErr?.message || smtpErr);
    }
  }

  throw smtpLastError || new Error('Failed to send email via SMTP');
};

// ---- POST /api/auth/register ----
// Register a new user (shop or customer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, shopName, address } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Prevent registering as admin via API
    if (role === 'admin') {
      return res.status(403).json({ message: 'Cannot register as admin' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'customer',
      shopName,
      address,
    });

    res.status(201).json({
      message: 'Registration successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- POST /api/auth/login ----
// Login existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare passwords
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- GET /api/auth/me ----
router.get('/me', protect, async (req, res) => {
  res.json({ user: req.user });
});

// ---- PUT /api/auth/me ----
// Update logged-in user's profile
router.put('/me', protect, async (req, res) => {
  try {
    const { name, email, phone, address, shopName } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return res.status(400).json({ message: 'Email is already in use by another account' });
      }
      user.email = email;
    }

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (user.role === 'shop' && shopName !== undefined) user.shopName = shopName;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ══════════════════════════════════════════
// FORGOT PASSWORD — 3 step flow
// ══════════════════════════════════════════

// ---- POST /api/auth/forgot-password ----
// Step 1: User enters email → receive OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const inputEmail = (req.body.email || '').trim();
    if (!inputEmail) return res.status(400).json({ message: 'Email is required' });

    const email = inputEmail.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'No account found with this email address' });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore[email] = { otp, expiresAt };

    // Send OTP email
    await sendEmail(
      email,
      '🌸 Bridal Orna — Password Reset OTP',
      `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 2rem; background: #fdf8f3; border-radius: 12px; border: 1px solid #e8d5c4;">
          <h2 style="color: #2c1a0e; font-family: Georgia, serif; text-align:center;">🌸 Bridal Orna</h2>
          <p style="color: #3d2314;">Hello <strong>${user.name}</strong>,</p>
          <p style="color: #6a4a3a;">Use the OTP below to reset your password:</p>
          <div style="background: #2c1a0e; color: #f0d9c8; font-size: 2.5rem; font-weight: bold; letter-spacing: 0.75rem; text-align: center; padding: 1.25rem; border-radius: 10px; margin: 1.5rem 0;">
            ${otp}
          </div>
          <p style="color: #a08070; font-size: 0.875rem; text-align: center;">⏰ Valid for <strong>10 minutes only</strong></p>
          <p style="color: #c08070; font-size: 0.8rem; text-align: center;">If you did not request this, ignore this email.</p>
        </div>
      `
    );

    res.json({ message: 'OTP sent to your email! Check your inbox.' });
  } catch (error) {
    console.error('Forgot password error:', error?.stack || error?.message || error);
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
});

// ---- POST /api/auth/verify-otp ----
// Step 2: Verify the OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const { otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });

    const record = otpStore[email];
    if (!record) return res.status(400).json({ message: 'No OTP found. Please request a new one.' });
    if (Date.now() > record.expiresAt) {
      delete otpStore[email];
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ message: 'Incorrect OTP. Please try again.' });

    res.json({ message: 'OTP verified!', verified: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- POST /api/auth/reset-password ----
// Step 3: Set new password
router.post('/reset-password', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const { otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields are required' });
    if (newPassword.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const record = otpStore[email];
    if (!record || Date.now() > record.expiresAt || record.otp !== otp.trim()) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please start over.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = newPassword; // pre-save hook hashes it
    await user.save();
    delete otpStore[email];

    res.json({ message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

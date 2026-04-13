// =============================================
// routes/orders.js - Order Routes
// With Email notification to admin on new order
// =============================================

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { uploadDesignImage } = require('../middleware/upload');
const nodemailer = require('nodemailer');

// ---- Helper: Send email notification to admin ----
const sendAdminEmailNotification = async (order, user, orderItems, totalAmount) => {
  try {
    const emailUser = (process.env.EMAIL_USER || '').trim();
    const emailPass = (process.env.EMAIL_PASS || '').trim();
    const orderNotificationRecipient = (process.env.ORDER_NOTIFICATION_EMAIL || 'arun983663@gmail.com').trim();

    if (!emailUser || !emailPass) {
      console.log('Email notification skipped - EMAIL_USER/PASS not set');
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const customerType = user.role === 'shop' ? '🏪 Shop / Retailer' : '👤 Individual Customer';
    const shopInfo = user.shopName ? `<p><strong>Shop Name:</strong> ${user.shopName}</p>` : '';
    const customDesignNote = order.customDesign?.requested
      ? `<div style="background:#f0e6ff;padding:0.75rem;border-radius:8px;margin-top:1rem;">
          <p style="color:#7b2d8b;font-weight:bold;">🎨 Custom Design Requested</p>
          ${order.customDesign.description ? `<p>${order.customDesign.description}</p>` : ''}
         </div>`
      : '';
    const notesSection = order.notes
      ? `<p><strong>Notes:</strong> ${order.notes}</p>`
      : '';

    const itemsRows = orderItems.map(item => `
      <tr>
        <td style="padding:0.6rem 1rem;border-bottom:1px solid #f0e4d8;">${item.productName}</td>
        <td style="padding:0.6rem 1rem;border-bottom:1px solid #f0e4d8;text-align:center;">${item.quantity}</td>
        <td style="padding:0.6rem 1rem;border-bottom:1px solid #f0e4d8;text-align:right;">৳${item.pricePerUnit.toLocaleString()}</td>
        <td style="padding:0.6rem 1rem;border-bottom:1px solid #f0e4d8;text-align:right;font-weight:bold;color:#c9956a;">৳${item.totalPrice.toLocaleString()}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fdf8f3;border-radius:12px;overflow:hidden;border:1px solid #e8d5c4;">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#2c1a0e,#5c2d1a);padding:2rem;text-align:center;">
          <h1 style="color:#f0d9c8;font-family:Georgia,serif;margin:0;font-size:1.5rem;">🌸 Bridal Orna</h1>
          <p style="color:#c9956a;margin:0.5rem 0 0;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;">New Order Received!</p>
        </div>

        <!-- Order ID Banner -->
        <div style="background:#c9956a;padding:0.75rem;text-align:center;">
          <p style="color:white;margin:0;font-weight:bold;font-size:1.1rem;">
            Order ID: #${order._id.toString().slice(-8).toUpperCase()}
          </p>
        </div>

        <!-- Content -->
        <div style="padding:1.5rem;">

          <!-- Customer Info -->
          <div style="background:white;border-radius:10px;padding:1.25rem;margin-bottom:1rem;border:1px solid #e8d5c4;">
            <h3 style="color:#2c1a0e;font-family:Georgia,serif;margin:0 0 1rem;font-size:1rem;border-bottom:1px solid #f0e4d8;padding-bottom:0.5rem;">👤 Customer Details</h3>
            <p style="margin:0.3rem 0;color:#3d2314;"><strong>Name:</strong> ${user.name}</p>
            ${shopInfo}
            <p style="margin:0.3rem 0;color:#3d2314;"><strong>Type:</strong> ${customerType}</p>
            <p style="margin:0.3rem 0;color:#3d2314;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin:0.3rem 0;color:#3d2314;"><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
            <p style="margin:0.3rem 0;color:#3d2314;"><strong>Address:</strong> ${user.address || 'Not provided'}</p>
            ${user.phone ? `
            <a href="https://wa.me/${user.phone.replace(/\D/g,'')}" 
               style="display:inline-block;margin-top:0.75rem;background:#25D366;color:white;padding:0.4rem 1rem;border-radius:6px;text-decoration:none;font-size:0.85rem;font-weight:bold;">
              💬 WhatsApp Customer
            </a>` : ''}
          </div>

          <!-- Order Items -->
          <div style="background:white;border-radius:10px;padding:1.25rem;margin-bottom:1rem;border:1px solid #e8d5c4;">
            <h3 style="color:#2c1a0e;font-family:Georgia,serif;margin:0 0 1rem;font-size:1rem;border-bottom:1px solid #f0e4d8;padding-bottom:0.5rem;">📦 Order Items</h3>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#f5ede3;">
                  <th style="padding:0.6rem 1rem;text-align:left;color:#6a4a3a;font-size:0.8rem;">Product</th>
                  <th style="padding:0.6rem 1rem;text-align:center;color:#6a4a3a;font-size:0.8rem;">Qty</th>
                  <th style="padding:0.6rem 1rem;text-align:right;color:#6a4a3a;font-size:0.8rem;">Price</th>
                  <th style="padding:0.6rem 1rem;text-align:right;color:#6a4a3a;font-size:0.8rem;">Total</th>
                </tr>
              </thead>
              <tbody>${itemsRows}</tbody>
            </table>
          </div>

          <!-- Total & Payment -->
          <div style="background:linear-gradient(135deg,#fdf3ea,#fdf8f3);border-radius:10px;padding:1.25rem;margin-bottom:1rem;border:1px solid #e8d5c4;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <div>
                <p style="margin:0;color:#6a4a3a;font-size:0.85rem;">Payment Method</p>
                <p style="margin:0.2rem 0 0;color:#5a8a5a;font-weight:bold;">✅ Cash on Delivery</p>
              </div>
              <div style="text-align:right;">
                <p style="margin:0;color:#6a4a3a;font-size:0.85rem;">Grand Total</p>
                <p style="margin:0.2rem 0 0;color:#c9956a;font-size:1.5rem;font-weight:bold;">৳${totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          ${notesSection}
          ${customDesignNote}

          <!-- Action Button -->
          <div style="text-align:center;margin-top:1.5rem;">
            <a href="${process.env.FRONTEND_URL || 'https://bridal-orna.vercel.app'}/admin/orders"
               style="background:linear-gradient(135deg,#c9956a,#a0714f);color:white;padding:0.875rem 2rem;border-radius:8px;text-decoration:none;font-weight:bold;font-size:1rem;">
              View in Admin Panel →
            </a>
          </div>

        </div>

        <!-- Footer -->
        <div style="background:#f5ede3;padding:1rem;text-align:center;border-top:1px solid #e8d5c4;">
          <p style="color:#a08070;font-size:0.75rem;margin:0;">
            © Bridal Orna — This is an automated notification email
          </p>
        </div>
      </div>
    `;

    let lastError = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const info = await transporter.sendMail({
          from: `"Bridal Orna Orders" <${emailUser}>`,
          to: orderNotificationRecipient,
          subject: `🌸 New Order #${order._id.toString().slice(-8).toUpperCase()} — ₹${totalAmount.toLocaleString()} — ${user.name}`,
          html,
        });

        console.log(`✅ Order notification email sent to ${orderNotificationRecipient} (${info.messageId})`);
        return { ok: true, recipient: orderNotificationRecipient };
      } catch (attemptErr) {
        lastError = attemptErr;
        console.log(`❌ Email attempt ${attempt} failed:`, attemptErr?.message || attemptErr);
      }
    }

    return { ok: false, error: lastError?.message || 'Unknown email error' };
  } catch (err) {
    console.log('❌ Admin email notification failed:', err?.message || err);
    return { ok: false, error: err?.message || 'Unknown email error' };
  }
};

// ---- POST /api/orders ----
router.post('/', protect, (req, res) => {
  uploadDesignImage(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { items, notes, customDesignDescription, customDesignRequested } = req.body;

      let parsedItems = items;
      if (typeof items === 'string') parsedItems = JSON.parse(items);

      if (!parsedItems || parsedItems.length === 0) {
        return res.status(400).json({ message: 'Order must have at least one item' });
      }

      const priceField = req.user.role === 'shop' ? 'shopPrice' : 'customerPrice';
      let orderItems = [];
      let totalAmount = 0;

      for (const item of parsedItems) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: `Product ${item.productId} not found` });
        if (product.stock < item.quantity) {
          return res.status(400).json({ message: `Insufficient stock for "${product.name}". Available: ${product.stock}` });
        }

        const pricePerUnit = product[priceField];
        const totalPrice = pricePerUnit * item.quantity;
        totalAmount += totalPrice;

        orderItems.push({
          product: product._id,
          productName: product.name,
          quantity: item.quantity,
          pricePerUnit,
          totalPrice,
        });

        product.stock -= item.quantity;
        await product.save();
      }

      const customDesign = {
        requested: customDesignRequested === 'true' || customDesignRequested === true,
        description: customDesignDescription || '',
        imagePath: req.file ? req.file.path : '',
      };

      const order = await Order.create({
        user: req.user._id,
        userSnapshot: {
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
          role: req.user.role,
          shopName: req.user.shopName,
          address: req.user.address,
        },
        items: orderItems,
        totalAmount,
        customDesign,
        notes,
      });

      // Return success immediately; send email in background so checkout never hangs.
      sendAdminEmailNotification(order, req.user, orderItems, totalAmount)
        .then((result) => {
          if (!result?.ok) {
            console.log('⚠️ Order email failed (background):', result?.error || 'Unknown error');
          }
        })
        .catch((emailErr) => {
          console.log('⚠️ Order email background task crashed:', emailErr?.message || emailErr);
        });

      res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

// ---- GET /api/orders/my ----
router.get('/my', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- GET /api/orders/:id ----
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
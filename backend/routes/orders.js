// =============================================
// routes/orders.js - Order Routes
// =============================================

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { uploadDesignImage } = require('../middleware/upload');

// ---- POST /api/orders ----
// Place a new order (authenticated users)
router.post('/', protect, (req, res) => {
  uploadDesignImage(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { items, notes, customDesignDescription, customDesignRequested } = req.body;

      // Parse items if it came as JSON string (multipart form)
      let parsedItems = items;
      if (typeof items === 'string') {
        parsedItems = JSON.parse(items);
      }

      if (!parsedItems || parsedItems.length === 0) {
        return res.status(400).json({ message: 'Order must have at least one item' });
      }

      // Determine price field based on user role
      const priceField = req.user.role === 'shop' ? 'shopPrice' : 'customerPrice';

      let orderItems = [];
      let totalAmount = 0;

      // Process each item in the order
      for (const item of parsedItems) {
        const product = await Product.findById(item.productId);

        if (!product) {
          return res.status(404).json({ message: `Product ${item.productId} not found` });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for "${product.name}". Available: ${product.stock}`,
          });
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

        // Reduce stock in real-time
        product.stock -= item.quantity;
        await product.save();
      }

      // Build custom design info if requested
      const customDesign = {
        requested: customDesignRequested === 'true' || customDesignRequested === true,
        description: customDesignDescription || '',
        imagePath: req.file ? req.file.path : '', // Cloudinary full URL
      };

      // Create the order
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

      res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

// ---- GET /api/orders/my ----
// Get logged-in user's order history
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
// Get single order detail (owner or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name images');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only the order owner or admin can view
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

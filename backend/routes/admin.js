// =============================================
// routes/admin.js - Admin-Only Routes
// =============================================

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, adminOnly);

// ---- GET /api/admin/orders ----
// Get all orders with optional filters
router.get('/orders', async (req, res) => {
  try {
    const { role, status } = req.query;

    let query = {};

    // Filter by status
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone role shopName address')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    // Filter by user role (shop vs customer) after population
    let filteredOrders = orders;
    if (role && role !== 'all') {
      filteredOrders = orders.filter((o) => o.userSnapshot.role === role);
    }

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- PUT /api/admin/orders/:id/status ----
// Update order status
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- GET /api/admin/dashboard ----
// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'Pending' });
    const inProgressOrders = await Order.countDocuments({ status: 'In Progress' });
    const deliveredOrders = await Order.countDocuments({ status: 'Delivered' });
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const shopUsers = await User.countDocuments({ role: 'shop' });
    const customerUsers = await User.countDocuments({ role: 'customer' });

    // Total revenue from delivered orders
    const deliveredOrderDocs = await Order.find({ status: 'Delivered' });
    const totalRevenue = deliveredOrderDocs.reduce((sum, o) => sum + o.totalAmount, 0);

    // Low stock products (stock < 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5, $gt: 0 }, isActive: true })
      .select('name stock')
      .limit(5);

    // Out of stock products
    const outOfStockCount = await Product.countDocuments({ stock: 0, isActive: true });

    res.json({
      totalOrders,
      pendingOrders,
      inProgressOrders,
      deliveredOrders,
      totalProducts,
      totalUsers,
      shopUsers,
      customerUsers,
      totalRevenue,
      lowStockProducts,
      outOfStockCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- GET /api/admin/users ----
// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

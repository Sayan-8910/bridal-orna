// =============================================
// routes/products.js - Product Routes
// =============================================

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload');

// ---- GET /api/products ----
// Get all active products (public) with optional search & filter
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice } = req.query;

    // Build filter query
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    // Filter by price if provided (use customerPrice as base)
    let filtered = products;
    if (minPrice) filtered = filtered.filter((p) => p.customerPrice >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.customerPrice <= Number(maxPrice));

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- GET /api/products/:id ----
// Get a single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ---- POST /api/products ----
// Admin: Add a new product with images
router.post('/', protect, adminOnly, (req, res) => {
  uploadProductImages(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const { name, description, customerPrice, shopPrice, stock, category } = req.body;

      if (!name || !customerPrice || !shopPrice) {
        return res.status(400).json({ message: 'Name, customer price, and shop price are required' });
      }

      // Get Cloudinary image URLs (path is now a full URL from Cloudinary)
      const images = req.files ? req.files.map((f) => f.path) : [];

      const product = await Product.create({
        name,
        description,
        customerPrice: Number(customerPrice),
        shopPrice: Number(shopPrice),
        stock: Number(stock) || 0,
        category,
        images,
      });

      res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

// ---- PUT /api/products/:id ----
// Admin: Update a product
router.put('/:id', protect, adminOnly, (req, res) => {
  uploadProductImages(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: 'Product not found' });

      const { name, description, customerPrice, shopPrice, stock, category, isActive, existingImages } = req.body;

      // Update fields
      if (name) product.name = name;
      if (description !== undefined) product.description = description;
      if (customerPrice) product.customerPrice = Number(customerPrice);
      if (shopPrice) product.shopPrice = Number(shopPrice);
      if (stock !== undefined) product.stock = Number(stock);
      if (category) product.category = category;
      if (isActive !== undefined) product.isActive = isActive === 'true';

      // Handle images: keep existing + add new
      let images = [];
      if (existingImages) {
        images = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
      if (req.files && req.files.length > 0) {
        const newImages = req.files.map((f) => f.path); // Cloudinary full URL
        images = [...images, ...newImages];
      }
      if (images.length > 0) product.images = images;

      await product.save();
      res.json({ message: 'Product updated successfully', product });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  });
});

// ---- DELETE /api/products/:id ----
// Admin: Delete a product
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

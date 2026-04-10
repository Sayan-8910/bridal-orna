// =============================================
// models/Product.js - Product Database Schema
// =============================================

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // Price for regular customers
    customerPrice: {
      type: Number,
      required: [true, 'Customer price is required'],
      min: 0,
    },
    // Lower price for shops (bulk buyers)
    shopPrice: {
      type: Number,
      required: [true, 'Shop price is required'],
      min: 0,
    },
    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      min: 0,
      default: 0,
    },
    // Array of image paths (supports multiple images)
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      trim: true,
      default: 'Bridal Dupatta',
    },
    // Whether the product is visible to users
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);

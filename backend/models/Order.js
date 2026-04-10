// =============================================
// models/Order.js - Order Database Schema
// =============================================

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    // Reference to the user who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Snapshot of user info at time of order
    userSnapshot: {
      name: String,
      email: String,
      phone: String,
      role: String,
      shopName: String,
      address: String,
    },
    // Items in the order
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        productName: String, // Snapshot of name at time of order
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        pricePerUnit: {
          type: Number,
          required: true,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    // Grand total
    totalAmount: {
      type: Number,
      required: true,
    },
    // Order status
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    // Custom design request details
    customDesign: {
      requested: { type: Boolean, default: false },
      description: String,
      imagePath: String, // Path to uploaded design reference image
    },
    // Payment method (always COD for now)
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery',
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);

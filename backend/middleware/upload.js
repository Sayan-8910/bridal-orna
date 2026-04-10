// =============================================
// middleware/upload.js - File Upload Config (Multer)
// =============================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const productUploadDir = path.join(__dirname, '../uploads/products');
const designUploadDir = path.join(__dirname, '../uploads/designs');

if (!fs.existsSync(productUploadDir)) fs.mkdirSync(productUploadDir, { recursive: true });
if (!fs.existsSync(designUploadDir)) fs.mkdirSync(designUploadDir, { recursive: true });

// Storage config for product images
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, productUploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: fieldname-timestamp.ext
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// Storage config for custom design images
const designStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, designUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'design-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File type filter - only allow images
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Upload middleware instances
const uploadProductImages = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
}).array('images', 10); // Accept up to 10 images with field name 'images'

const uploadDesignImage = multer({
  storage: designStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('designImage'); // Single design reference image

module.exports = { uploadProductImages, uploadDesignImage };

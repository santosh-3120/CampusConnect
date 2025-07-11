// middleware/uploadMiddleware.js

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary'); // make sure this is correct!

// ✅ Setup Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'CampusConnect', // your folder name in Cloudinary
    allowed_formats: ['jpeg', 'jpg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

// ✅ Setup multer with Cloudinary storage
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;

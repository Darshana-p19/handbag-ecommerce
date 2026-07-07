const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Use memory storage (no local files)
const storage = multer.memoryStorage();

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// Upload multiple images to Cloudinary
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log(`   Files: ${req.files ? req.files.length : 0}`);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one file' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return res.status(500).json({ 
        message: 'Cloudinary is not configured. Please check environment variables.',
        details: 'Missing Cloudinary credentials'
      });
    }

    // Upload all images to Cloudinary
    const uploadPromises = req.files.map(async (file) => {
      try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        console.log(`   Uploading: ${file.originalname} (${file.size} bytes)`);
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'handbag-store',
          width: 800,
          crop: 'scale',
          quality: 'auto',
          fetch_format: 'auto'
        });
        
        console.log(`   ✅ Uploaded: ${result.secure_url}`);
        return {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        console.error(`   ❌ Failed to upload ${file.originalname}:`, uploadError.message);
        throw uploadError;
      }
    });

    const results = await Promise.all(uploadPromises);
    const images = results.map(result => ({
      url: result.url,
      public_id: result.public_id
    }));

    console.log(`✅ ${images.length} images uploaded to Cloudinary`);
    res.json(images);
  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // Send detailed error response
    res.status(500).json({ 
      message: 'Failed to upload images',
      error: error.message,
      details: error.stack
    });
  }
});

// Upload single image to Cloudinary
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return res.status(500).json({ 
        message: 'Cloudinary is not configured. Please check environment variables.'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'handbag-store',
      width: 800,
      crop: 'scale',
      quality: 'auto',
      fetch_format: 'auto'
    });

    console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
    
    res.json({
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

module.exports = router;
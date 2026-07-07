const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// ✅ Use memory storage
const storage = multer.memoryStorage();

// ✅ Configure multer
const upload = multer({ 
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// ✅ Upload multiple images to Cloudinary
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log(`   Files: ${req.files ? req.files.length : 0}`);
    
    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload at least one file' 
      });
    }

    // Check Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return res.status(500).json({ 
        success: false,
        message: 'Cloudinary is not configured properly',
        error: 'Missing credentials'
      });
    }

    console.log('☁️ Uploading to Cloudinary...');

    // ✅ Upload each image to Cloudinary
    const uploadPromises = req.files.map(async (file, index) => {
      try {
        // Convert buffer to base64
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        console.log(`   Uploading image ${index + 1}: ${file.originalname} (${file.size} bytes)`);
        
        // ✅ Upload to Cloudinary
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'handbag-store',
          width: 800,
          crop: 'scale',
          quality: 'auto',
          fetch_format: 'auto'
        });
        
        console.log(`   ✅ Image ${index + 1} uploaded: ${result.secure_url}`);
        
        return {
          url: result.secure_url,
          public_id: result.public_id
        };
      } catch (uploadError) {
        console.error(`   ❌ Failed to upload image ${index + 1}:`, uploadError.message);
        throw new Error(`Failed to upload ${file.originalname}: ${uploadError.message}`);
      }
    });

    // ✅ Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);
    
    // ✅ Extract just the URLs
    const imageUrls = results.map(result => result.url);

    console.log(`✅ Successfully uploaded ${imageUrls.length} images to Cloudinary`);
    
    // ✅ Return success response
    res.json({
      success: true,
      images: imageUrls,
      count: imageUrls.length
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    
    // ✅ Return detailed error
    res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

// ✅ Upload single image to Cloudinary
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Single upload request received');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Please upload a file' 
      });
    }

    // Check Cloudinary credentials
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return res.status(500).json({ 
        success: false,
        message: 'Cloudinary is not configured properly'
      });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log(`   Uploading: ${req.file.originalname} (${req.file.size} bytes)`);

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
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to upload image',
      error: error.message 
    });
  }
});

module.exports = router;
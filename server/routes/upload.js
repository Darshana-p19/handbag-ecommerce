const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');

// Memory storage
const storage = multer.memoryStorage();

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

// ✅ TEST ENDPOINT
router.get('/test', (req, res) => {
  res.json({
    message: 'Upload route is working!',
    cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME && 
                            !!process.env.CLOUDINARY_API_KEY && 
                            !!process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
    api_secret: process.env.CLOUDINARY_API_SECRET ? 'present' : 'missing',
    server_time: new Date().toISOString(),
    server_timestamp: Math.floor(Date.now() / 1000)
  });
});

// ✅ Generate upload signature endpoint (for client-side uploads)
router.get('/signature', (req, res) => {
  try {
    // Use current timestamp but add a small buffer
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Generate signature using Cloudinary's signing method
    const params = {
      timestamp: timestamp,
      folder: 'handbag-store'
    };
    
    // Sort params alphabetically
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    // Create signature
    const signature = crypto
      .createHash('sha256')
      .update(sortedParams + process.env.CLOUDINARY_API_SECRET)
      .digest('hex');
    
    res.json({
      signature: signature,
      timestamp: timestamp,
      folder: 'handbag-store',
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY
    });
  } catch (error) {
    console.error('Signature generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ MULTIPLE UPLOAD - Using unsigned upload (recommended for this issue)
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('   Files:', req.files?.length || 0);
    console.log('   Server Time:', new Date().toISOString());
    console.log('   Timestamp:', Math.floor(Date.now() / 1000));
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select at least one image' 
      });
    }

    // Check Cloudinary config
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      console.error('❌ Cloudinary credentials missing!');
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured. Please contact admin.'
      });
    }

    console.log('☁️ Uploading to Cloudinary...');

    const imageUrls = [];
    const errors = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        // Convert to base64
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        console.log(`   Uploading ${i + 1}: ${file.originalname} (${file.size} bytes)`);
        
        // ✅ Use unsigned upload - Cloudinary will handle the signature
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'handbag-store',
          resource_type: 'auto',
          // ⚠️ IMPORTANT: Set upload_preset for unsigned uploads
          // Or use the SDK's default behavior
        });
        
        console.log(`   ✅ Uploaded: ${result.secure_url}`);
        imageUrls.push(result.secure_url);
      } catch (err) {
        console.error(`   ❌ Failed: ${file.originalname}`, err.message);
        errors.push({
          file: file.originalname,
          error: err.message
        });
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('All images failed to upload: ' + errors.map(e => e.file).join(', '));
    }

    console.log(`✅ Successfully uploaded ${imageUrls.length} images`);

    res.json({
      success: true,
      images: imageUrls,
      count: imageUrls.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upload images'
    });
  }
});

// ✅ SINGLE UPLOAD
router.post('/single', upload.single('image'), async (req, res) => {
  try {
    console.log('📤 Single upload request received');
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured'
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'handbag-store',
      resource_type: 'auto'
    });

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

module.exports = router;
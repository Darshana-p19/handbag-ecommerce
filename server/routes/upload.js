const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

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

// ✅ MULTIPLE UPLOAD - FIXED VERSION
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

    // Upload each image
    const imageUrls = [];
    const errors = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        
        console.log(`   Uploading ${i + 1}: ${file.originalname} (${file.size} bytes)`);
        
        // ✅ IMPORTANT: Use upload_stream instead of upload to avoid timestamp issues
        const result = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'handbag-store',
              resource_type: 'auto',
              // ✅ Don't manually set timestamp - let Cloudinary handle it
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          // Write the buffer to the stream
          uploadStream.end(file.buffer);
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

// ✅ SINGLE UPLOAD - FIXED VERSION
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

    // ✅ Use upload_stream instead
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'handbag-store',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      
      uploadStream.end(req.file.buffer);
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
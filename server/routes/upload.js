const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

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
    cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
    api_key: process.env.CLOUDINARY_API_KEY ? 'present' : 'missing',
    upload_preset: 'handbag-store',
    server_time: new Date().toISOString()
  });
});

// ✅ MULTIPLE UPLOAD - Using unsigned upload preset
router.post('/multiple', upload.array('images', 10), async (req, res) => {
  try {
    console.log('📤 Upload request received');
    console.log('   Files:', req.files?.length || 0);
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please select at least one image' 
      });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.error('❌ Cloudinary cloud name missing!');
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured'
      });
    }

    console.log('☁️ Uploading to Cloudinary using unsigned preset...');
    console.log(`   Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    console.log(`   Upload Preset: handbag-store`);

    const imageUrls = [];
    const errors = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        console.log(`   Uploading ${i + 1}: ${file.originalname} (${file.size} bytes)`);
        
        // ✅ IMPORTANT: Use FormData for unsigned upload
        const formData = new FormData();
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
        formData.append('upload_preset', 'handbag-store');
        formData.append('folder', 'handbag-store');
        
        // Upload directly to Cloudinary API
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData,
          {
            headers: {
              ...formData.getHeaders()
            },
            timeout: 30000 // 30 seconds timeout
          }
        );
        
        console.log(`   ✅ Uploaded: ${response.data.secure_url}`);
        imageUrls.push(response.data.secure_url);
      } catch (err) {
        console.error(`   ❌ Failed: ${file.originalname}`, err.response?.data?.error?.message || err.message);
        errors.push({
          file: file.originalname,
          error: err.response?.data?.error?.message || err.message
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

    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return res.status(500).json({
        success: false,
        message: 'Cloudinary not configured'
      });
    }

    console.log(`☁️ Uploading: ${req.file.originalname}`);
    
    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('upload_preset', 'handbag-store');
    formData.append('folder', 'handbag-store');
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    console.log(`✅ Uploaded: ${response.data.secure_url}`);

    res.json({
      success: true,
      url: response.data.secure_url,
      public_id: response.data.public_id
    });

  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: error.response?.data?.error?.message || error.message
    });
  }
});

module.exports = router;
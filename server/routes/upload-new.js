const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

console.log('Ì∫Ä LOADING NEW UPLOAD ROUTE WITH UNSIGNED PRESET');

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

router.get('/test', (req, res) => {
  res.json({
    message: 'NEW UPLOAD ROUTE - UNSIGNED PRESET',
    version: '4.0',
    cloudinary_configured: !!process.env.CLOUDINARY_CLOUD_NAME,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
    upload_preset: 'handbag-store'
  });
});

router.post('/multiple', upload.array('images', 10), async (req, res) => {
  console.log('Ì≥§ NEW UPLOAD ROUTE v4.0 - UNSIGNED PRESET');
  console.log('   Files:', req.files?.length || 0);
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images' });
    }

    console.log('‚òÅÔ∏è Uploading with unsigned preset...');
    console.log(`   Preset: handbag-store`);

    const imageUrls = [];
    const errors = [];
    
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      try {
        console.log(`   Uploading ${i + 1}: ${file.originalname} (${file.size} bytes)`);
        
        const formData = new FormData();
        formData.append('file', file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype
        });
        formData.append('upload_preset', 'handbag-store');
        formData.append('folder', 'handbag-store');
        formData.append('public_id', `product-${Date.now()}-${i}`);
        
        const response = await axios({
          method: 'post',
          url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          data: formData,
          headers: formData.getHeaders(),
          timeout: 30000
        });
        
        console.log(`   ‚úÖ Uploaded: ${response.data.secure_url}`);
        imageUrls.push(response.data.secure_url);
      } catch (err) {
        console.error(`   ‚ùå Failed: ${file.originalname}`, err.response?.data?.error?.message || err.message);
        errors.push({ file: file.originalname, error: err.response?.data?.error?.message || err.message });
      }
    }

    if (imageUrls.length === 0) {
      throw new Error('All images failed to upload');
    }

    res.json({ success: true, images: imageUrls, count: imageUrls.length, errors: errors.length > 0 ? errors : undefined });
  } catch (error) {
    console.error('‚ùå Upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/single', upload.single('image'), async (req, res) => {
  console.log('Ì≥§ NEW SINGLE UPLOAD v4.0');
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file' });
    }

    const formData = new FormData();
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append('upload_preset', 'handbag-store');
    formData.append('folder', 'handbag-store');
    
    const response = await axios({
      method: 'post',
      url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      data: formData,
      headers: formData.getHeaders()
    });

    res.json({ success: true, url: response.data.secure_url, public_id: response.data.public_id });
  } catch (error) {
    console.error('Upload error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.response?.data?.error?.message || error.message });
  }
});

module.exports = router;

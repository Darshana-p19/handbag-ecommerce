const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with proper settings
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  // ✅ Force using UTC time
  timeout: 60000
});

// Log configuration (without exposing secrets)
console.log('☁️ Cloudinary configured:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Present' : '❌ MISSING');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ MISSING');

module.exports = cloudinary;
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

// Test the configuration
console.log('☁️ Cloudinary configured:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ MISSING');
console.log('   API Key:', process.env.CLOUDINARY_API_KEY ? '✅ Present' : '❌ MISSING');
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Present' : '❌ MISSING');

module.exports = cloudinary;
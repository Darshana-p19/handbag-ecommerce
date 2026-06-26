const admin = require('firebase-admin');
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const db = admin.firestore();

async function migrateProducts() {
  console.log('🔄 Starting migration...');
  const snapshot = await db.collection('products').get();
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (data.images && Array.isArray(data.images)) {
      const newImages = [];
      let needsUpdate = false;

      for (const imgUrl of data.images) {
        if (imgUrl.includes('cloudinary.com')) {
          newImages.push(imgUrl);
          continue;
        }

        try {
          console.log(`📤 Uploading: ${imgUrl}`);
          const result = await cloudinary.uploader.upload(imgUrl, {
            folder: 'handbag-store'
          });
          newImages.push(result.secure_url);
          needsUpdate = true;
          console.log(`✅ Uploaded for ${doc.id}`);
        } catch (error) {
          console.error(`❌ Failed for ${doc.id}:`, error.message);
          newImages.push(imgUrl);
        }
      }

      if (needsUpdate) {
        await doc.ref.update({ images: newImages });
        count++;
        console.log(`✅ Updated product: ${doc.id}`);
      }
    }
  }

  console.log(`✅ Migrated ${count} products!`);
}

migrateProducts();
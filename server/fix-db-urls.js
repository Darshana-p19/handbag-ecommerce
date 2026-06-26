const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

const db = admin.firestore();
const BASE_URL = 'https://handbag-ecommerce.onrender.com';

async function fixDatabaseUrls() {
  try {
    console.log('Ì¥Ñ Fixing database image URLs...');
    const snapshot = await db.collection('products').get();
    
    if (snapshot.empty) {
      console.log('‚ùå No products found');
      return;
    }

    console.log(`Ì≥¶ Found ${snapshot.size} products`);
    let updatedCount = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      
      if (data.images && Array.isArray(data.images)) {
        const newImages = data.images.map(img => {
          if (img && img.includes('localhost:5000')) {
            return img.replace('http://localhost:5000', BASE_URL);
          }
          return img;
        });

        if (JSON.stringify(data.images) !== JSON.stringify(newImages)) {
          await doc.ref.update({ images: newImages });
          updatedCount++;
          console.log(`‚úÖ Updated product: ${doc.id}`);
        }
      }
    }

    console.log(`‚úÖ Successfully updated ${updatedCount} products!`);
    console.log(`Ì¥ó Images now point to: ${BASE_URL}/uploads/`);
  } catch (error) {
    console.error('‚ùå Error:', error);
  }
}

fixDatabaseUrls();

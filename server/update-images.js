const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

const db = admin.firestore();

async function updateProductImages() {
  const baseUrl = 'https://handbag-ecommerce.onrender.com';
  
  try {
    const productsRef = db.collection('products');
    const snapshot = await productsRef.get();
    
    if (snapshot.empty) {
      console.log('No products found.');
      return;
    }

    let updatedCount = 0;

    snapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.images && Array.isArray(data.images)) {
        const updatedImages = data.images.map(img => {
          if (img.includes('localhost:5000')) {
            return img.replace('http://localhost:5000', baseUrl);
          }
          return img;
        });

        if (JSON.stringify(data.images) !== JSON.stringify(updatedImages)) {
          await doc.ref.update({ images: updatedImages });
          updatedCount++;
          console.log(`✅ Updated product: ${doc.id}`);
        }
      }
    });

    console.log(`✅ Successfully updated ${updatedCount} products!`);
  } catch (error) {
    console.error('❌ Error updating products:', error);
  }
}

updateProductImages();
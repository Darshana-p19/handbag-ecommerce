const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
console.log('🔧 Initializing Firebase...');

try {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error.message);
  process.exit(1);
}

const db = admin.firestore();
const baseUrl = 'https://handbag-ecommerce.onrender.com';

async function fixAllProducts() {
  try {
    console.log('🔄 Fetching products from Firestore...');
    
    const snapshot = await db.collection('products').get();
    
    if (snapshot.empty) {
      console.log('❌ No products found in database.');
      return;
    }

    console.log(`📦 Found ${snapshot.size} products.`);
    let count = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      let needsUpdate = false;
      let newImages = [];
      
      if (data.images && Array.isArray(data.images)) {
        newImages = data.images.map(img => {
          if (img && img.includes('localhost:5000')) {
            needsUpdate = true;
            return img.replace('http://localhost:5000', baseUrl);
          }
          // Also fix if it's using localhost without http
          if (img && img.includes('localhost:5000')) {
            needsUpdate = true;
            return img.replace('localhost:5000', baseUrl);
          }
          return img;
        });

        if (needsUpdate) {
          await doc.ref.update({ images: newImages });
          count++;
          console.log(`✅ Fixed product: ${doc.id} - ${data.title || 'No title'}`);
        }
      }
    }

    console.log(`✅ Successfully fixed ${count} out of ${snapshot.size} products!`);
    
    if (count === 0) {
      console.log('ℹ️ No products needed fixing. All images already use production URLs.');
    }
  } catch (error) {
    console.error('❌ Error fixing products:', error);
  }
}

// Run the function
fixAllProducts();
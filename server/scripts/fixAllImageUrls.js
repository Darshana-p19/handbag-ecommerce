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

async function fixAllImageUrls() {
  console.log('🔧 Fixing ALL image URLs...\n');
  
  const snapshot = await db.collection('products').get();
  let fixedCount = 0;
  let totalImages = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const title = data.title || 'No title';
    
    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
      console.log(`⚠️  ${doc.id} - "${title}" - No images`);
      continue;
    }

    totalImages += data.images.length;
    let needsUpdate = false;
    
    const newImages = data.images.map(img => {
      if (!img || typeof img !== 'string') return img;
      
      // Fix localhost URLs
      if (img.includes('localhost')) {
        needsUpdate = true;
        const fixed = img.replace(/http:\/\/localhost:5000/g, BASE_URL)
                        .replace(/localhost:5000/g, BASE_URL);
        console.log(`   ❌ ${img}`);
        console.log(`   ✅ ${fixed}`);
        return fixed;
      }
      
      // Fix paths without domain
      if (img.startsWith('/uploads/')) {
        needsUpdate = true;
        const fixed = `${BASE_URL}${img}`;
        console.log(`   ❌ ${img}`);
        console.log(`   ✅ ${fixed}`);
        return fixed;
      }
      
      return img;
    });

    if (needsUpdate) {
      await doc.ref.update({ images: newImages, updatedAt: new Date().toISOString() });
      fixedCount++;
      console.log(`✅ Fixed: ${doc.id} - "${title}"\n`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📊 Summary:`);
  console.log(`   Total products: ${snapshot.size}`);
  console.log(`   Total images: ${totalImages}`);
  console.log(`   Fixed products: ${fixedCount}`);
  console.log(`   Base URL: ${BASE_URL}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  process.exit(0);
}

fixAllImageUrls().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
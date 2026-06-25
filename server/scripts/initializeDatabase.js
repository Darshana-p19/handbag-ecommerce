const { admin, collections } = require('../config/firebase');

async function initializeDatabase() {
  console.log('🚀 Initializing HandbagStore Database...\n');

  // 1. Create Default Categories
  console.log('Creating categories...');
  const categories = [
    { name: 'Handbags', slug: 'handbags', description: 'Elegant handbags for every occasion', productCount: 0, isActive: true },
    { name: 'Pouches', slug: 'pouches', description: 'Stylish pouches for organization', productCount: 0, isActive: true },
    { name: 'Wallets', slug: 'wallets', description: 'Premium wallets for men and women', productCount: 0, isActive: true },
    { name: 'Purses', slug: 'purses', description: 'Chic purses for daily use', productCount: 0, isActive: true },
    { name: 'Tote Bags', slug: 'tote-bags', description: 'Spacious tote bags for shopping', productCount: 0, isActive: true },
    { name: 'Sling Bags', slug: 'sling-bags', description: 'Trendy sling bags for casual wear', productCount: 0, isActive: true }
  ];

  for (const category of categories) {
    await collections.categories.add({
      ...category,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  ✅ Category: ${category.name}`);
  }

  // 2. Create Default Colors
  console.log('\nCreating colors...');
  const colors = [
    { name: 'Black', hexCode: '#000000', isActive: true },
    { name: 'White', hexCode: '#FFFFFF', isActive: true },
    { name: 'Red', hexCode: '#FF0000', isActive: true },
    { name: 'Blue', hexCode: '#0000FF', isActive: true },
    { name: 'Green', hexCode: '#008000', isActive: true },
    { name: 'Pink', hexCode: '#FFC0CB', isActive: true },
    { name: 'Brown', hexCode: '#8B4513', isActive: true },
    { name: 'Gold', hexCode: '#FFD700', isActive: true },
    { name: 'Silver', hexCode: '#C0C0C0', isActive: true },
    { name: 'Purple', hexCode: '#800080', isActive: true },
    { name: 'Navy Blue', hexCode: '#000080', isActive: true },
    { name: 'Beige', hexCode: '#F5F5DC', isActive: true },
    { name: 'Grey', hexCode: '#808080', isActive: true },
    { name: 'Maroon', hexCode: '#800000', isActive: true },
    { name: 'Olive', hexCode: '#808000', isActive: true }
  ];

  for (const color of colors) {
    await collections.colors.add({
      ...color,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  ✅ Color: ${color.name} (${color.hexCode})`);
  }

  // 3. Create Site Settings
  console.log('\nCreating site settings...');
  await collections.settings.doc('site-settings').set({
    siteName: 'HandbagStore',
    tagline: 'Premium Handbags & Accessories',
    phone: '+919876543210',
    whatsapp: '+919876543210',
    email: 'support@handbagstore.com',
    address: 'Mumbai, Maharashtra, India',
    workingHours: 'Mon-Sat: 9:00 AM - 6:00 PM',
    socialMedia: {
      facebook: 'https://facebook.com/handbagstore',
      instagram: 'https://instagram.com/handbagstore',
      twitter: 'https://twitter.com/handbagstore',
      pinterest: 'https://pinterest.com/handbagstore'
    },
    currency: 'INR',
    currencySymbol: '₹',
    whatsappMessage: 'Hi! I am interested in buying:',
    aboutUs: 'We are passionate about creating beautiful, functional bags that complement your lifestyle.',
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log('  ✅ Site settings created');

  // 4. Create Sample FAQs
  console.log('\nCreating FAQs...');
  const faqs = [
    {
      question: 'How do I place an order?',
      answer: 'Simply click the WhatsApp button on any product to message us directly. Our team will assist you with your order.',
      order: 1,
      isActive: true
    },
    {
      question: 'What are your delivery charges?',
      answer: 'We offer free delivery on orders above ₹999. For orders below ₹999, a nominal delivery charge applies.',
      order: 2,
      isActive: true
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days across India.',
      order: 3,
      isActive: true
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 7-day return policy for unused products with original tags and packaging.',
      order: 4,
      isActive: true
    }
  ];

  for (const faq of faqs) {
    await collections.faqs.add({
      ...faq,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    console.log(`  ✅ FAQ: ${faq.question}`);
  }

  console.log('\n✅ Database initialization complete!');
  console.log(`\n📊 Summary:`);
  console.log(`   - ${categories.length} Categories created`);
  console.log(`   - ${colors.length} Colors created`);
  console.log(`   - ${faqs.length} FAQs created`);
  console.log(`   - Site settings configured`);
  console.log('\n🔑 Admin Login:');
  console.log('   Email: admin@handbagstore.com');
  console.log('   Password: admin123');
  
  process.exit(0);
}

initializeDatabase().catch(error => {
  console.error('❌ Database initialization failed:', error);
  process.exit(1);
});
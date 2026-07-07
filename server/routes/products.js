const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// ✅ Dynamic BASE_URL
const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://handbag-ecommerce.onrender.com'
  : 'http://localhost:5000';

// ✅ Fixed image URL helper
function getImageUrl(imagePath) {
  if (!imagePath) return `${BASE_URL}/uploads/default-product.jpg`;
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  if (imagePath.startsWith('/uploads/')) return `${BASE_URL}${imagePath}`;
  if (imagePath.startsWith('uploads/')) return `${BASE_URL}/${imagePath}`;
  return `${BASE_URL}/uploads/${imagePath}`;
}

// GET all products
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('products').get();
    const products = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      let images = data.images || [];
      images = images.length > 0 ? images.map(img => getImageUrl(img)) : [`${BASE_URL}/uploads/default-product.jpg`];
      
      products.push({
        id: doc.id,
        title: data.title || 'Untitled',
        description: data.description || '',
        price: Number(data.price) || 999,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        discountPercentage: data.discountPercentage || 0,
        category: data.category || 'Uncategorized',
        color: data.color || 'Not specified',
        stock: Number(data.stock) || 10,
        images: images,
        featured: data.featured || false,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    
    console.log(`✅ Fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: error.message, products: [] });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Product not found' });
    
    const data = doc.data();
    let images = data.images || [];
    images = images.length > 0 ? images.map(img => getImageUrl(img)) : [`${BASE_URL}/uploads/default-product.jpg`];
    
    res.json({
      id: doc.id,
      ...data,
      images: images,
      price: Number(data.price) || 999,
      originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
      stock: Number(data.stock) || 10
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create product
router.post('/', async (req, res) => {
  try {
    const { title, description, price, originalPrice, category, color, stock, images } = req.body;
    const sellingPrice = parseFloat(price) || 0;
    const mrpPrice = originalPrice ? parseFloat(originalPrice) : null;

    if (sellingPrice <= 0) return res.status(400).json({ message: 'Price must be greater than 0' });
    if (mrpPrice && mrpPrice <= sellingPrice) return res.status(400).json({ message: 'Original price must be higher than selling price' });

    const discountPercentage = mrpPrice && mrpPrice > sellingPrice ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) : 0;

    const productData = {
      title: title || 'Untitled',
      description: description || '',
      price: sellingPrice,
      originalPrice: mrpPrice,
      discountPercentage,
      category: category || 'Uncategorized',
      color: color || 'Not specified',
      stock: parseInt(stock) || 10,
      images: images || [],
      featured: req.body.featured || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('products').add(productData);
    console.log('✅ Product created:', docRef.id);
    res.status(201).json({ id: docRef.id, ...productData });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update product
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body, updatedAt: new Date().toISOString() };
    if (updateData.price !== undefined) updateData.price = parseFloat(updateData.price) || 0;
    if (updateData.stock !== undefined) updateData.stock = parseInt(updateData.stock) || 0;
    
    await db.collection('products').doc(req.params.id).update(updateData);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
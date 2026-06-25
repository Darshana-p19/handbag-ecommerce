const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Helper function to get image URL
function getImageUrl(imagePath) {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) return `http://localhost:5000${imagePath}`;
  return `http://localhost:5000/uploads/${imagePath}`;
}

// Get all products - SIMPLE QUERY WITHOUT FILTERS
router.get('/', async (req, res) => {
  try {
    // Simple get all - no where clauses, no orderBy
    const snapshot = await db.collection('products').get();
    const products = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      let images = data.images || [];
      if (images.length > 0) {
        images = images.map(img => getImageUrl(img));
      } else {
        // Default image based on category
        const defaultImage = 'http://localhost:5000/uploads/1779962036809-860053923.jpeg';
        images = [defaultImage];
      }
      
      products.push({
        id: doc.id,
        title: data.title || 'Untitled',
        description: data.description || '',
        price: Number(data.price) || 999,
        originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
        category: data.category || 'Uncategorized',
        color: data.color || 'Not specified',
        stock: Number(data.stock) || 10,
        images: images,
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

// Get single product - INCLUDES ALL FIELDS
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const data = doc.data();
    let images = data.images || [];
    if (images.length > 0) {
      images = images.map(img => getImageUrl(img));
    }
    
    res.json({
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
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create product
// router.post('/', async (req, res) => {
//   try {
//     const productData = {
//       title: req.body.title || 'Untitled',
//       description: req.body.description || '',
//       price: Number(req.body.price) || 999,
//       originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : null,
//       category: req.body.category || 'Uncategorized',
//       color: req.body.color || 'Not specified',
//       stock: Number(req.body.stock) || 10,
//       images: req.body.images || [],
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };
    
//     const docRef = await db.collection('products').add(productData);
//     console.log('✅ Product created:', docRef.id);
//     res.status(201).json({ id: docRef.id, ...productData });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({ message: error.message });
//   }
// });

// Update product

// In POST route, update the product creation:
router.post('/', async (req, res) => {
  try {
    const { 
      title, description, price, originalPrice, category, color, stock, images 
    } = req.body;

    // Parse prices
    const sellingPrice = parseFloat(price) || 0;
    const mrpPrice = originalPrice ? parseFloat(originalPrice) : null;

    // Validate prices
    if (sellingPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (mrpPrice && mrpPrice <= sellingPrice) {
      return res.status(400).json({ 
        message: 'Original price (MRP) must be higher than selling price' 
      });
    }

    // Calculate discount percentage
    const discountPercentage = mrpPrice && mrpPrice > sellingPrice 
      ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) 
      : 0;

    const productData = {
      title: title || 'Untitled',
      description: description || '',
      price: sellingPrice,
      originalPrice: mrpPrice,
      discountPercentage: discountPercentage, // Store calculated discount
      category: category || 'Uncategorized',
      color: color || 'Not specified',
      stock: parseInt(stock) || 10,
      images: images || [],
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

// Create product - WITH PRICE VALIDATION
router.post('/', async (req, res) => {
  try {
    const { 
      title, description, price, originalPrice, category, color, stock, images 
    } = req.body;

    const sellingPrice = parseFloat(price) || 0;
    const mrpPrice = originalPrice ? parseFloat(originalPrice) : null;

    if (sellingPrice <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }

    if (mrpPrice && mrpPrice <= sellingPrice) {
      return res.status(400).json({ 
        message: 'Original price (MRP) must be higher than selling price' 
      });
    }

    const discountPercentage = mrpPrice && mrpPrice > sellingPrice 
      ? Math.round(((mrpPrice - sellingPrice) / mrpPrice) * 100) 
      : 0;

    const productData = {
      title: title || 'Untitled',
      description: description || '',
      price: sellingPrice,
      originalPrice: mrpPrice,
      discountPercentage: discountPercentage,
      category: category || 'Uncategorized',
      color: color || 'Not specified',
      stock: parseInt(stock) || 10,
      images: images || [],
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

// Update product - WITH PRICE VALIDATION
router.put('/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    const docRef = db.collection('products').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const existingData = doc.data();
    
    if (updateData.price !== undefined) {
      updateData.price = parseFloat(updateData.price) || 0;
      if (updateData.price <= 0) {
        return res.status(400).json({ message: 'Price must be greater than 0' });
      }
    }

    if (updateData.originalPrice !== undefined) {
      if (updateData.originalPrice === '' || updateData.originalPrice === null) {
        updateData.originalPrice = null;
        updateData.discountPercentage = 0;
      } else {
        updateData.originalPrice = parseFloat(updateData.originalPrice);
        const sellingPrice = updateData.price !== undefined ? updateData.price : existingData.price;
        
        if (updateData.originalPrice <= sellingPrice) {
          return res.status(400).json({ 
            message: 'Original price (MRP) must be higher than selling price' 
          });
        }
        
        updateData.discountPercentage = Math.round(
          ((updateData.originalPrice - sellingPrice) / updateData.originalPrice) * 100
        );
      }
    }

    if (updateData.stock !== undefined) {
      updateData.stock = parseInt(updateData.stock) || 0;
    }

    updateData.updatedAt = new Date().toISOString();
    
    await docRef.update(updateData);
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;


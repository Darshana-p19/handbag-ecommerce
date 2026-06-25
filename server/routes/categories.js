const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// GET all categories (simplified - no complex queries)
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('categories').get();
    
    const categories = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      categories.push({
        id: doc.id,
        name: data.name || 'Unnamed',
        description: data.description || '',
        image: data.image || '',
        isActive: data.isActive !== undefined ? data.isActive : true,
        sortOrder: data.sortOrder || 0
      });
    });

    // Sort by sortOrder or name
    categories.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
    
    console.log('Categories fetched:', categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET single category
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('categories').doc(req.params.id).get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const data = doc.data();
    res.json({
      id: doc.id,
      name: data.name,
      description: data.description || '',
      image: data.image || ''
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST create category
router.post('/', async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryName = name.trim();
    
    // Check if category already exists
    const existingSnapshot = await db.collection('categories')
      .where('name', '==', categoryName)
      .limit(1)
      .get();

    if (!existingSnapshot.empty) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const categoryData = {
      name: categoryName,
      description: description || '',
      image: image || '',
      isActive: true,
      sortOrder: Date.now(),
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('categories').add(categoryData);
    
    res.status(201).json({
      id: docRef.id,
      ...categoryData,
      message: 'Category created successfully'
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT update category
router.put('/:id', async (req, res) => {
  try {
    const docRef = db.collection('categories').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updates = { 
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    await docRef.update(updates);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE category
router.delete('/:id', async (req, res) => {
  try {
    const docRef = db.collection('categories').doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await docRef.delete();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

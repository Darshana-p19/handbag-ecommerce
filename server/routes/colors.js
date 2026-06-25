const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Get all colors
router.get('/', async (req, res) => {
  try {
    const snapshot = await db.collection('colors').get();
    
    if (snapshot.empty) {
      // Return default colors if none exist
      const defaultColors = [
        { id: '1', name: 'Black', value: 'black', isActive: true },
        { id: '2', name: 'Brown', value: 'brown', isActive: true },
        { id: '3', name: 'Red', value: 'red', isActive: true },
        { id: '4', name: 'Blue', value: 'blue', isActive: true },
        { id: '5', name: 'Green', value: 'green', isActive: true },
        { id: '6', name: 'Pink', value: 'pink', isActive: true },
        { id: '7', name: 'White', value: 'white', isActive: true }
      ];
      return res.json(defaultColors);
    }
    
    const colors = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      colors.push({
        id: doc.id,
        name: data.name || data.value || 'Unknown',
        value: data.value || data.name,
        isActive: data.isActive !== false
      });
    });
    
    res.json(colors);
  } catch (error) {
    console.error('Error fetching colors:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get single color
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('colors').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Color not found' });
    }
    const data = doc.data();
    res.json({ 
      id: doc.id, 
      name: data.name || data.value,
      value: data.value || data.name,
      isActive: data.isActive !== false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new color
router.post('/', async (req, res) => {
  try {
    const { name, value, isActive } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Color name is required' });
    }
    
    const colorValue = (value || name).toLowerCase().trim();
    const colorName = name.trim();
    
    // Check if color already exists
    const existingSnapshot = await db.collection('colors')
      .where('value', '==', colorValue)
      .limit(1)
      .get();
    
    if (!existingSnapshot.empty) {
      return res.status(400).json({ message: 'Color already exists' });
    }
    
    const colorData = {
      name: colorName,
      value: colorValue,
      isActive: isActive !== false,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('colors').add(colorData);
    res.status(201).json({ id: docRef.id, ...colorData });
  } catch (error) {
    console.error('Error creating color:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update color
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, isActive } = req.body;
    
    const updates = {
      updatedAt: new Date().toISOString()
    };
    
    if (name) updates.name = name.trim();
    if (value) updates.value = value.toLowerCase().trim();
    if (isActive !== undefined) updates.isActive = isActive;
    
    await db.collection('colors').doc(id).update(updates);
    res.json({ message: 'Color updated successfully' });
  } catch (error) {
    console.error('Error updating color:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete color
router.delete('/:id', async (req, res) => {
  try {
    const docRef = db.collection('colors').doc(req.params.id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({ message: 'Color not found' });
    }
    
    await docRef.delete();
    res.json({ message: 'Color deleted successfully' });
  } catch (error) {
    console.error('Error deleting color:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

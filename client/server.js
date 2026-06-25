const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const colorRoutes = require('./routes/colors');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/upload');

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://handbag-store.vercel.app' // Your Vercel URL
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/colors', colorRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Debug endpoint to check products
app.get('/api/debug-products', async (req, res) => {
  try {
    const { db } = require('./config/firebase');
    const snapshot = await db.collection('products').get();
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data(),
        price: Number(doc.data().price) || 0
      });
    });
    res.json({
      count: products.length,
      products: products,
      sample: products[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  console.log('Route not found:', req.method, req.url);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`��� Server running on port ${PORT}`);
  console.log(`��� API available at http://localhost:${PORT}/api`);
  console.log(`��� Health check: http://localhost:${PORT}/api/health`);
  console.log(`��� Test: http://localhost:${PORT}/api/test`);
  console.log(`��� Debug products: http://localhost:${PORT}/api/debug-products`);
});

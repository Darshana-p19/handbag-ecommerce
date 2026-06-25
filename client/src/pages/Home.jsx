import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaTruck, FaShieldAlt, FaUndo, FaHeadset } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { darkMode } = useTheme();

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?featured=true&limit=8');
      setFeaturedProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { name: 'Handbags', image: '/categories/handbags.jpg', count: '150+', icon: '👜' },
    { name: 'Pouches', image: '/categories/pouches.jpg', count: '80+', icon: '👛' },
    { name: 'Wallets', image: '/categories/wallets.jpg', count: '120+', icon: '💳' },
    { name: 'Purses', image: '/categories/purses.jpg', count: '60+', icon: '👜' },
    { name: 'Tote Bags', image: '/categories/tote-bags.jpg', count: '90+', icon: '🛍️' },
    { name: 'Sling Bags', image: '/categories/sling-bags.jpg', count: '100+', icon: '🎒' },
  ];

  const features = [
    { icon: FaTruck, title: 'Free Shipping', description: 'On orders above ₹999' },
    { icon: FaShieldAlt, title: 'Secure Payment', description: '100% secure transactions' },
    { icon: FaUndo, title: 'Easy Returns', description: '7-day return policy' },
    { icon: FaHeadset, title: '24/7 Support', description: 'Dedicated customer support' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className={`relative h-[600px] flex items-center overflow-hidden ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-primary-dark' 
          : 'bg-gradient-to-br from-primary via-secondary to-primary-light'
      }`}>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-playfair font-bold text-white mb-6 leading-tight">
                Elegance in
                <br />
                <span className="text-primary-light">Every Stitch</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-xl text-gray-200 mb-8 max-w-xl"
            >
              Discover our exclusive collection of handcrafted bags and accessories.
              Where style meets functionality, and every piece tells a story.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/products"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
              >
                Shop Now
              </Link>
              <Link
                to="/products?sort=latest"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all"
              >
                New Arrivals
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`text-center p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <feature.icon className="text-4xl text-primary mx-auto mb-4" />
                <h3 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className={`text-4xl font-playfair font-bold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Shop by Category
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Find your perfect match from our wide range of categories
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.name}`}
                  className="block group"
                >
                  <div className={`relative overflow-hidden rounded-2xl shadow-lg group-hover:shadow-2xl transition-all duration-300 ${
                    darkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="aspect-square relative">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<div class="flex items-center justify-center h-full text-6xl">${category.icon}</div>`;
                        }}
                      />
                      <div className={`absolute inset-0 bg-black bg-opacity-30 group-hover:bg-opacity-40 transition-all duration-300 ${
                        darkMode ? 'bg-opacity-50' : 'bg-opacity-30'
                      }`} />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                        <p className="text-sm opacity-90">{category.count} Products</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className={`text-4xl font-playfair font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Trending Now
              </h2>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Our most loved products this week
              </p>
            </motion.div>
            <Link
              to="/products"
              className={`hidden md:inline-flex items-center font-semibold transition-colors ${
                darkMode ? 'text-primary-light hover:text-primary' : 'text-primary hover:text-secondary'
              }`}
            >
              View All
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className={`rounded-2xl overflow-hidden animate-pulse ${
                  darkMode ? 'bg-gray-700' : 'bg-white'
                }`}>
                  <div className="aspect-square skeleton"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 skeleton rounded w-1/4"></div>
                    <div className="h-6 skeleton rounded w-3/4"></div>
                    <div className="h-4 skeleton rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p className="text-xl">No featured products yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className={`absolute inset-0 ${
          darkMode 
            ? 'bg-gradient-to-r from-gray-800 to-primary-dark' 
            : 'bg-gradient-to-r from-primary to-secondary'
        }`} />
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6">
              Get 20% Off Your First Order
            </h2>
            <p className="text-white text-lg mb-8 opacity-90">
              Subscribe to our newsletter and stay updated with the latest trends and exclusive offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-white bg-white/10 backdrop-blur-sm text-white placeholder-gray-300 border border-white/20"
              />
              <button className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
                Subscribe Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default Home;
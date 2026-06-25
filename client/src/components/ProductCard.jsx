import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaStar, FaStarHalfAlt, FaMinus, FaPlus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import CONFIG, { formatPrice, calculateDiscount, calculateSavings, getWhatsAppUrl, getImageUrl } from '../config/constants';

function ProductCard({ product }) {
  const { darkMode } = useTheme();
  const [quantity, setQuantity] = useState(1);

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const whatsappUrl = getWhatsAppUrl(product, quantity);
    window.open(whatsappUrl, '_blank');
  };

  const increaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity < 10) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const renderStars = (rating) => {
    const stars = [];
    const validRating = (rating && !isNaN(rating)) ? rating : 4.5;
    const fullStars = Math.floor(validRating);
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-400 w-4 h-4" />);
    }
    if (validRating - fullStars >= 0.5) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-400 w-4 h-4" />);
    }
    return stars;
  };

  const productPrice = product?.price || 0;
  const productOriginalPrice = product?.originalPrice || null;
  const productStock = product?.stock || 10;
  const productImage = getImageUrl(product?.images?.[0]);
  const productTitle = product?.title || 'Untitled Product';
  const productCategory = product?.category || 'Uncategorized';
  const productColor = product?.color || 'Not specified';
  
  const discount = productOriginalPrice ? calculateDiscount(productOriginalPrice, productPrice) : 0;
  const savings = productOriginalPrice ? calculateSavings(productOriginalPrice, productPrice) : 0;
  const totalPrice = productPrice * quantity;
  const totalSavings = savings * quantity;
  const extraCharge = CONFIG.EXTRA_CHARGE;
  const grandTotal = totalPrice + extraCharge;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ${
        darkMode ? 'bg-gray-800 shadow-gray-900/50' : 'bg-white'
      }`}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-square">
          <img
            src={productImage}
            alt={productTitle}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.src = CONFIG.PLACEHOLDER_IMAGE;
            }}
          />
          
          {productStock > 0 && productStock <= 5 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Only {productStock} left
            </div>
          )}
          
          {productStock === 0 && (
            <div className="absolute top-3 left-3 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              Out of Stock
            </div>
          )}

          {discount > 0 && (
            <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
              {discount}% OFF
            </div>
          )}

          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
            darkMode ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'
          }`}>
            {productCategory}
          </span>
          <div className="flex items-center space-x-1">
            {renderStars(4.5)}
            <span className={`text-xs ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              (24)
            </span>
          </div>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className={`font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors ${
            darkMode ? 'text-gray-100' : 'text-gray-800'
          }`}>
            {productTitle}
          </h3>
        </Link>

        {productColor && productColor !== 'Not specified' && (
          <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            🎨 Color: {productColor}
          </p>
        )}

        <div className="mb-3">
          <div className="flex items-baseline space-x-2">
            <span className={`text-2xl font-bold ${
              darkMode ? 'text-primary-light' : 'text-primary'
            }`}>
              {formatPrice(productPrice)}
            </span>
            
            {productOriginalPrice && productOriginalPrice > productPrice && (
              <span className={`text-sm line-through ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {formatPrice(productOriginalPrice)}
              </span>
            )}
          </div>
          
          {savings > 0 && (
            <p className="text-xs text-green-600 mt-1 font-medium">
              Save {formatPrice(savings)} ({discount}% OFF)
            </p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quantity:
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={decreaseQuantity}
                className={`p-1 rounded-md transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={quantity <= 1}
              >
                <FaMinus className="w-3 h-3" />
              </button>
              <span className={`w-8 text-center text-sm font-semibold ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {quantity}
              </span>
              <button
                onClick={increaseQuantity}
                className={`p-1 rounded-md transition-colors ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                disabled={quantity >= 10}
              >
                <FaPlus className="w-3 h-3" />
              </button>
            </div>
          </div>
          
          {quantity > 1 && (
            <div className={`mt-2 p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Total: <span className="font-bold text-primary">{formatPrice(grandTotal)}</span>
                <span className="block text-green-600 text-[10px]">
                  (includes ₹{extraCharge} shipping)
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Link
            to={`/product/${product.id}`}
            className={`flex-1 text-center py-2 rounded-lg transition-all duration-300 text-sm font-semibold ${
              darkMode
                ? 'bg-primary/20 text-primary-light hover:bg-primary/30'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            View Details
          </Link>
          <button
            onClick={handleWhatsAppOrder}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-1"
            title="Order on WhatsApp"
          >
            <FaWhatsapp className="text-lg" />
            {quantity > 1 && <span className="text-xs">({quantity})</span>}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default ProductCard;
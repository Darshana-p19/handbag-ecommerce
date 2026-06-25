import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaWhatsapp, FaStar, FaTruck, FaShieldAlt, FaUndo, FaMinus, FaPlus } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';
import CONFIG, { formatPrice, calculateDiscount, calculateSavings, getWhatsAppUrl, getImageUrl } from '../config/constants';

function ProductDetails() {
  const { id } = useParams();
  const { darkMode } = useTheme();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/products/${id}`);
      setProduct(response.data);
      await fetchRelatedProducts(response.data.category);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`${CONFIG.API_URL}/products`);
      const products = response.data || [];
      setRelatedProducts(products.filter(p => p.id !== id).slice(0, 4));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const increaseQuantity = () => {
    if (quantity < 10) setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleWhatsAppOrder = () => {
    const whatsappUrl = getWhatsAppUrl(product, quantity);
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className={`h-96 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
            <div className="space-y-4">
              <div className={`h-8 rounded w-3/4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
              <div className={`h-6 rounded w-1/4 ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
              <div className={`h-4 rounded w-full ${darkMode ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className={`text-2xl font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Product not found
        </h2>
      </div>
    );
  }

  const productPrice = product.price || 0;
  const productOriginalPrice = product.originalPrice || null;
  const discount = productOriginalPrice ? calculateDiscount(productOriginalPrice, productPrice) : 0;
  const savings = productOriginalPrice ? calculateSavings(productOriginalPrice, productPrice) : 0;
  const totalPrice = productPrice * quantity;
  const totalSavings = savings * quantity;
  const extraCharge = CONFIG.EXTRA_CHARGE;
  const grandTotal = totalPrice + extraCharge;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Product Images */}
            <div>
              <div className={`relative rounded-2xl overflow-hidden mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                <img
                  src={getImageUrl(product.images?.[selectedImage])}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                  onError={(e) => { e.target.src = CONFIG.DEFAULT_PRODUCT_IMAGE; }}
                />
                {discount > 0 && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                    {discount}% OFF
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {(product.images || []).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    } ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-24 object-cover"
                      onError={(e) => { e.target.src = CONFIG.PLACEHOLDER_IMAGE; }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {product.category || 'Uncategorized'}
                </span>
                {product.color && product.color !== 'Not specified' && (
                  <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    🎨 {product.color}
                  </span>
                )}
                <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {(product.stock || 0) > 0 ? `📦 ${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
              
              <h1 className={`text-3xl md:text-4xl font-playfair font-bold mt-4 mb-2 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {product.title || 'Untitled Product'}
              </h1>

              {/* <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < 4 ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  (24 reviews)
                </span>
              </div> */}

              {/* Price Section */}
              <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-primary">
                    {formatPrice(productPrice)}
                  </span>
                  {productOriginalPrice && productOriginalPrice > productPrice && (
                    <>
                      <span className={`text-xl line-through ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {formatPrice(productOriginalPrice)}
                      </span>
                      <span className="text-lg font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {savings > 0 && (
                  <p className="text-green-600 font-medium">
                    🎉 You save {formatPrice(savings)} on this product!
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Select Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={decreaseQuantity}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span className={`text-2xl font-bold w-12 text-center ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    disabled={quantity >= 10}
                  >
                    <FaPlus />
                  </button>
                </div>
                
                {/* Price Breakdown with Extra Charge */}
                <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Subtotal:</span>
                      <span className="text-lg font-semibold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Shipping & Handling:</span>
                      <span className="text-lg font-semibold text-orange-500">{formatPrice(extraCharge)}</span>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-600">Total Savings:</span>
                        <span className="text-sm font-semibold text-green-600">{formatPrice(totalSavings)}</span>
                      </div>
                    )}
                    <div className={`border-t pt-2 ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Grand Total:</span>
                        <span className="text-2xl font-bold text-primary">{formatPrice(grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Description
                </h3>
                <p className={`leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {product.description || 'No description available.'}
                </p>
              </div> */}

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 text-white py-4 rounded-xl hover:bg-green-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-3 text-lg font-semibold shadow-lg mb-8"
              >
                <FaWhatsapp className="text-2xl" />
                <span>Order on WhatsApp {quantity > 1 ? `(${quantity} items)` : ''}</span>
              </button>

              <div className={`border-t pt-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <FaTruck className="text-primary text-2xl mx-auto mb-2" />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Free Shipping
                    </p>
                  </div>
                  <div>
                    <FaShieldAlt className="text-primary text-2xl mx-auto mb-2" />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Secure Payment
                    </p>
                  </div>
                  <div>
                    <FaUndo className="text-primary text-2xl mx-auto mb-2" />
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Easy Returns
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className={`text-2xl font-playfair font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default ProductDetails;
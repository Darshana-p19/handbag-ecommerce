import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaShoppingBag, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import CONFIG from '../config/constants';

function Footer() {
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('import.meta.env.VITE_API_URL/api/categories');
        const activeCategories = response.data.filter(cat => cat.isActive !== false);
        setCategories(activeCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([
          { id: '1', name: 'Handbags' },
          { id: '2', name: 'Wallets' },
          { id: '3', name: 'Purses' },
          { id: '4', name: 'Tote Bags' },
          { id: '5', name: 'Sling Bags' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Use constants from CONFIG
  const footerSections = [
    {
      title: 'Quick Links',
      links: CONFIG.QUICK_LINKS
    },
    {
      title: 'Categories',
      links: loading 
        ? [{ name: 'Loading...', to: '#' }]
        : categories.map(cat => ({
            name: cat.name,
            to: `/products?category=${cat.name}`
          }))
    },
    {
      title: 'Customer Service',
      links: CONFIG.SERVICE_LINKS
    }
  ];

  const socialLinks = [
    { icon: FaWhatsapp, url: CONFIG.SOCIAL_WHATSAPP, label: 'WhatsApp' },
    { icon: FaInstagram, url: CONFIG.SOCIAL_INSTAGRAM, label: 'Instagram' }
  ];

  const contactInfo = [
    { icon: FaMapMarkerAlt, text: CONFIG.BUSINESS_ADDRESS },
    { icon: FaPhone, text: CONFIG.BUSINESS_PHONE },
    { icon: FaEnvelope, text: CONFIG.BUSINESS_EMAIL },
  ];

  return (
    <footer className={`${
      darkMode 
        ? 'bg-gray-900 text-gray-300 border-t border-gray-800' 
        : 'bg-gray-50 text-gray-600 border-t border-gray-200'
    } transition-colors duration-300`}>
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <FaShoppingBag className="text-2xl text-primary group-hover:scale-110 transition-transform" />
              <span className="text-2xl font-playfair font-bold text-primary">
                {CONFIG.BUSINESS_DISPLAY_NAME}
              </span>
            </Link>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Your one-stop destination for premium handbags and accessories. 
              Quality craftsmanship meets contemporary design. Shop with confidence 
              knowing each piece is carefully curated for you.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <info.icon className="text-primary flex-shrink-0" />
                  <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {info.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    darkMode 
                      ? 'bg-gray-800 text-gray-400 hover:bg-primary hover:text-white' 
                      : 'bg-gray-200 text-gray-600 hover:bg-primary hover:text-white'
                  }`}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className={`text-lg font-semibold mb-4 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.to}
                      className={`transition-colors duration-300 hover:text-primary ${
                        darkMode ? 'text-gray-400 hover:text-primary-light' : 'text-gray-600'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`border-t ${
        darkMode ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © {new Date().getFullYear()} {CONFIG.BUSINESS_DISPLAY_NAME}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
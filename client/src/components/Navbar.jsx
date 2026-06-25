import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShoppingBag,
  FaSearch,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaUser,
  FaHeart,
  FaShoppingCart,
} from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import Logo from "./Logo";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setSearchQuery("");
      setSearchOpen(false);
      setIsOpen(false);
    }
  };

  const categories = [
    { name: "Handbags", icon: "👜", count: "150+" },
    { name: "Pouches", icon: "👛", count: "80+" },
    { name: "Wallets", icon: "💳", count: "120+" },
    { name: "Purses", icon: "👜", count: "60+" },
    { name: "Tote Bags", icon: "🛍️", count: "90+" },
    { name: "Sling Bags", icon: "🎒", count: "100+" },
  ];

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Products", to: "/products" },
    { name: "About", to: "/about" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg"
          : "bg-white dark:bg-gray-900 shadow-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
    
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2 group">
              <img
                src={logo}
                alt="Handbag Store"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div className="hidden sm:block">
                <span className="font-playfair text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
                  Handbag Store
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">
                  Premium Handbags
                </p>
              </div>
            </Link>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="nav-link px-3 py-2 rounded-lg text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              {/* <button className="nav-link px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-1">
                <span>Categories</span>
                <FaChevronDown
                  className={`w-3 h-3 transition-transform duration-300 ${categoriesOpen ? "rotate-180" : ""}`}
                />
              </button> */}

              <AnimatePresence>
                {categoriesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                  >
                    <div className="p-2">
                      {categories.map((category) => (
                        <Link
                          key={category.name}
                          to={`/products?category=${category.name}`}
                          className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group"
                          onClick={() => setCategoriesOpen(false)}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-xl">{category.icon}</span>
                            <span className="text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {category.count}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Toggle - Desktop */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search bags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 lg:w-56 pl-10 pr-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm transition-all duration-300"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
              </form>
            </div>

            {/* Wishlist Button */}
            {/* <button className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <FaHeart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button> */}

            {/* Cart Button */}
            {/* <button className="hidden md:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
              <FaShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                0
              </span>
            </button> */}

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
              aria-label="Toggle dark mode"
            >
              <div className="relative w-5 h-5">
                <FaSun
                  className={`absolute inset-0 text-yellow-500 transform transition-all duration-300 ${
                    darkMode
                      ? "opacity-0 rotate-90 scale-0"
                      : "opacity-100 rotate-0 scale-100"
                  }`}
                />
                <FaMoon
                  className={`absolute inset-0 text-gray-400 dark:text-gray-300 transform transition-all duration-300 ${
                    darkMode
                      ? "opacity-100 rotate-0 scale-100"
                      : "opacity-0 -rotate-90 scale-0"
                  }`}
                />
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                  >
                    <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                  >
                    <FaBars className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden border-t border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="px-2 pt-3 pb-4 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="px-2 mb-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search bags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-gray-100"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  </div>
                </form>

                {/* Navigation Links */}
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="mobile-nav-link"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="py-2">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Categories
                  </p>
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      to={`/products?category=${category.name}`}
                      className="mobile-nav-link flex items-center justify-between pl-6"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {category.count}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Mobile Action Buttons */}
                <div className="grid grid-cols-2 gap-2 px-2 pt-2">
                  <button className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors">
                    <FaHeart className="w-4 h-4" />
                    <span className="text-sm">Wishlist</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors">
                    <FaShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default Navbar;

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFilter, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';
import CONFIG from '../config/constants';

// ✅ Use the API URL from constants
const API_URL = CONFIG.API_URL;

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const { darkMode } = useTheme();
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    color: searchParams.get('color') || 'All',
    sort: searchParams.get('sort') || 'latest',
    search: searchParams.get('search') || '',
  });

  useEffect(() => {
    fetchCategories();
    fetchColors();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchProducts();
  }, [filters]);

  // ✅ UPDATED: Use API_URL from constants
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // ✅ UPDATED: Use API_URL from constants
  const fetchColors = async () => {
    try {
      const response = await axios.get(`${API_URL}/colors`);
      setColors(response.data || []);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  };

  // ✅ UPDATED: Use API_URL from constants
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      let filteredProducts = response.data || [];
      
      console.log('All products:', filteredProducts);
      
      // Filter by category
      if (filters.category && filters.category !== 'All') {
        filteredProducts = filteredProducts.filter(p => 
          p.category && p.category.toLowerCase() === filters.category.toLowerCase()
        );
      }
      
      // Filter by color
      if (filters.color && filters.color !== 'All') {
        filteredProducts = filteredProducts.filter(p => 
          p.color && p.color.toLowerCase() === filters.color.toLowerCase()
        );
      }
      
      // Filter by price
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => 
          (p.price || 0) >= Number(filters.minPrice)
        );
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => 
          (p.price || 0) <= Number(filters.maxPrice)
        );
      }
      
      // Filter by search
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          (p.title && p.title.toLowerCase().includes(searchLower)) ||
          (p.description && p.description.toLowerCase().includes(searchLower))
        );
      }
      
      // Sort products
      if (filters.sort === 'price-low') {
        filteredProducts.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (filters.sort === 'price-high') {
        filteredProducts.sort((a, b) => (b.price || 0) - (a.price || 0));
      } else if (filters.sort === 'name-asc') {
        filteredProducts.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      } else if (filters.sort === 'name-desc') {
        filteredProducts.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      }
      
      console.log('Filtered products:', filteredProducts.length);
      setProducts(filteredProducts);
      
      const total = Math.ceil(filteredProducts.length / productsPerPage);
      setTotalPages(total > 0 ? total : 1);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    if (key !== 'page') {
      setSearchParams({ ...filters, [key]: value });
    }
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      minPrice: '',
      maxPrice: '',
      color: 'All',
      sort: 'latest',
      search: '',
    });
    setSearchParams({});
    setCurrentPage(1);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCurrentPageProducts = () => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return products.slice(startIndex, endIndex);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4);
      }
      if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3);
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  const sorts = [
    { value: 'latest', label: 'Latest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];

  const uniqueCategories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))];
  const uniqueColors = ['All', ...new Set(products.map(p => p.color).filter(Boolean))];
  const currentProducts = getCurrentPageProducts();

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={`text-4xl font-playfair font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Our Collection
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              {products.length} products found
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-lg bg-primary text-white"
          >
            <FaFilter />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className={`sticky top-24 rounded-2xl shadow-lg p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Filters</h3>
                <button onClick={clearFilters} className="text-sm text-primary hover:text-secondary">
                  Clear All
                </button>
              </div>

              <div className="mb-6">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    placeholder="Search products..."
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-white border-gray-300'}`}
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uniqueCategories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat}
                        onChange={() => handleFilterChange('category', cat)}
                        className="mr-2 text-primary"
                      />
                      <span className="text-sm capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Price Range (₹)</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                  <span>-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Color</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {uniqueColors.map(col => (
                    <label key={col} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        checked={filters.color === col}
                        onChange={() => handleFilterChange('color', col)}
                        className="mr-2 text-primary"
                      />
                      <span className="text-sm capitalize">{col}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button onClick={() => setShowFilters(false)} className="lg:hidden w-full btn-primary mt-4">
                Apply Filters
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className={`flex flex-wrap gap-2 mb-6 p-4 rounded-lg shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              {sorts.map(sort => (
                <button
                  key={sort.value}
                  onClick={() => handleFilterChange('sort', sort.value)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                    filters.sort === sort.value
                      ? 'bg-primary text-white shadow-md'
                      : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className={`rounded-2xl overflow-hidden animate-pulse ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <div className="aspect-square bg-gray-300 dark:bg-gray-700"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="text-2xl font-semibold mb-4">No products found</p>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="btn-primary mt-4">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center space-x-2">
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === 1
                          ? 'opacity-50 cursor-not-allowed'
                          : darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      <FaChevronLeft className="mr-2" size={12} />
                      Previous
                    </button>

                    <div className="flex items-center space-x-1">
                      {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            onClick={() => goToPage(page)}
                            className={`w-10 h-10 rounded-lg transition-all duration-300 ${
                              currentPage === page
                                ? 'bg-primary text-white shadow-md scale-105'
                                : darkMode 
                                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      ))}
                    </div>

                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                        currentPage === totalPages
                          ? 'opacity-50 cursor-not-allowed'
                          : darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      }`}
                    >
                      Next
                      <FaChevronRight className="ml-2" size={12} />
                    </button>
                  </div>
                )}

                <div className="text-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Showing {((currentPage - 1) * productsPerPage) + 1} - {Math.min(currentPage * productsPerPage, products.length)} of {products.length} products
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
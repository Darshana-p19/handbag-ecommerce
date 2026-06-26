import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaBox, FaList, FaPlus, FaSignOutAlt, FaChartBar, FaPalette } from 'react-icons/fa';
import toast from 'react-hot-toast';
import AdminProducts from '../components/admin/AdminProducts';
import AdminAddProduct from '../components/admin/AdminAddProduct';
import AdminCategories from '../components/admin/AdminCategories';
import AdminColors from '../components/admin/AdminColors';
import AdminDashboard from '../components/admin/AdminDashboard';

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate('/admin/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    navigate('/admin/login');
    toast.success('Logged out successfully');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white min-h-screen shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
          </div>
          
          <nav className="mt-6">
            <Link to="/admin" className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors">
              <FaChartBar className="mr-3" />
              Dashboard
            </Link>
            <Link to="/admin/products" className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors">
              <FaBox className="mr-3" />
              Products
            </Link>
            <Link to="/admin/products/add" className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors">
              <FaPlus className="mr-3" />
              Add Product
            </Link>
            <Link to="/admin/categories" className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors">
              <FaList className="mr-3" />
              Categories
            </Link>
            <Link to="/admin/colors" className="flex items-center px-6 py-3 text-gray-700 hover:bg-primary hover:text-white transition-colors">
              <FaPalette className="mr-3" />
              Colors
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-6 py-3 text-gray-700 hover:bg-red-500 hover:text-white transition-colors"
            >
              <FaSignOutAlt className="mr-3" />
              Logout
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminAddProduct />} />
            <Route path="products/edit/:id" element={<AdminAddProduct />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="colors" element={<AdminColors />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUpload, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';
import CONFIG from '../../config/constants';

const API_URL = CONFIG.API_URL;

function AdminAddProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    color: '',
    stock: '10',
    images: []
  });
  
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchColors();
  }, []);

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      const activeCategories = response.data.filter(cat => cat.isActive);
      setCategories(activeCategories);
      
      if (!formData.category && activeCategories.length > 0) {
        setFormData(prev => ({ ...prev, category: activeCategories[0].name }));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${API_URL}/colors`);
      const activeColors = response.data.filter(color => color.isActive);
      setColors(activeColors);
      
      if (!formData.color && activeColors.length > 0) {
        setFormData(prev => ({ ...prev, color: activeColors[0].name }));
      }
    } catch (error) {
      console.error('Error fetching colors:', error);
      toast.error('Failed to load colors');
    } finally {
      setLoadingData(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      const product = response.data;
      setFormData({
        title: product.title || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category || '',
        color: product.color || '',
        stock: product.stock?.toString() || '10',
        images: product.images || []
      });
    } catch (error) {
      toast.error('Failed to fetch product');
      navigate('/admin/products');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleImageUpload = async () => {
    if (imageFiles.length === 0) return [];

    const uploadFormData = new FormData();
    imageFiles.forEach(file => {
      uploadFormData.append('images', file);
    });

    const response = await axios.post(`${API_URL}/upload/multiple`, uploadFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data.map(img => img.url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    if (!formData.color) {
      toast.error('Please select a color');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    if (formData.originalPrice && parseFloat(formData.originalPrice) <= parseFloat(formData.price)) {
      toast.error('Original price (MRP) must be higher than selling price');
      return;
    }
    
    setUploading(true);

    try {
      const newImageUrls = await handleImageUpload();
      const allImages = [...formData.images, ...newImageUrls];

      const productData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        stock: parseInt(formData.stock) || 0,
        images: allImages
      };

      if (isEditMode) {
        await axios.put(`${API_URL}/products/${id}`, productData);
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${API_URL}/products`, productData);
        toast.success('Product created successfully');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h2>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Product title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="Product description"
            />
          </div>

          {/* Price & Original Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selling Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="1999"
              />
              <p className="text-xs text-gray-500 mt-1">The price customers will pay</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (MRP) ₹</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="1"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="2499"
              />
              <p className="text-xs text-gray-500 mt-1">Higher than selling price to show discount</p>
            </div>
          </div>

          {/* Discount Preview */}
          {formData.price && formData.originalPrice && 
            parseFloat(formData.originalPrice) > parseFloat(formData.price) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 font-medium">
                🎉 Discount: {Math.round(((parseFloat(formData.originalPrice) - parseFloat(formData.price)) / parseFloat(formData.originalPrice)) * 100)}% OFF
              </p>
              <p className="text-green-600 text-sm">
                Customers save ₹{parseFloat(formData.originalPrice) - parseFloat(formData.price)} per item
              </p>
            </div>
          )}

          {/* Category & Color */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="text-red-500 text-sm mt-1">
                  No categories found. Please add categories first.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <select
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Select Color</option>
                {colors.map(color => (
                  <option key={color.id} value={color.name}>{color.name}</option>
                ))}
              </select>
              {colors.length === 0 && (
                <p className="text-gray-500 text-sm mt-1">
                  No colors added yet. You can add colors from the Colors page.
                </p>
              )}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
              placeholder="10"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Images</label>
            
            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mb-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FaUpload className="text-3xl text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">Drag and drop images or click to browse</p>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary transition-colors inline-block"
              >
                Select Images
              </label>
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {imageFiles.length} file(s) selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {imageFiles.map((file, index) => (
                    <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || categories.length === 0}
              className={`px-6 py-2 bg-primary text-white rounded-lg transition-colors ${
                uploading || categories.length === 0 ? 'opacity-70 cursor-not-allowed' : 'hover:bg-secondary'
              }`}
            >
              {uploading ? 'Saving...' : isEditMode ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AdminAddProduct;
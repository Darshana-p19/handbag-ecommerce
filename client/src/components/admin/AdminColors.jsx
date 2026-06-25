import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaPalette, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import toast from 'react-hot-toast';

function AdminColors() {
  const [colors, setColors] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingColor, setEditingColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    hexCode: '#000000',
    isActive: true
  });

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/colors');
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
      toast.error('Failed to fetch colors');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Color name is required');
      return;
    }

    setLoading(true);
    try {
      if (editingColor) {
        await axios.put(`http://localhost:5000/api/colors/${editingColor.id}`, formData);
        toast.success('Color updated successfully');
      } else {
        await axios.post('http://localhost:5000/api/colors', formData);
        toast.success('Color added successfully');
      }
      fetchColors();
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save color');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this color?')) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:5000/api/colors/${id}`);
        toast.success('Color deleted successfully');
        fetchColors();
      } catch (error) {
        toast.error('Failed to delete color');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleActive = async (color) => {
    try {
      await axios.put(`http://localhost:5000/api/colors/${color.id}`, {
        ...color,
        isActive: !color.isActive
      });
      toast.success(`Color ${!color.isActive ? 'activated' : 'deactivated'} successfully`);
      fetchColors();
    } catch (error) {
      toast.error('Failed to update color status');
    }
  };

  const handleEdit = (color) => {
    setEditingColor(color);
    setFormData({
      name: color.name,
      value: color.value || color.name.toLowerCase(),
      hexCode: color.hexCode || '#000000',
      isActive: color.isActive !== false
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingColor(null);
    setShowColorPicker(false);
    setFormData({ 
      name: '', 
      value: '', 
      hexCode: '#000000', 
      isActive: true 
    });
  };

  // Predefined colors palette with hex codes
  const predefinedColors = [
    { name: 'Black', value: 'black', hexCode: '#000000' },
    { name: 'Dark Brown', value: 'dark-brown', hexCode: '#5C4033' },
    { name: 'Brown', value: 'brown', hexCode: '#8B4513' },
    { name: 'Tan', value: 'tan', hexCode: '#D2B48C' },
    { name: 'Red', value: 'red', hexCode: '#FF0000' },
    { name: 'Burgundy', value: 'burgundy', hexCode: '#800020' },
    { name: 'Blue', value: 'blue', hexCode: '#0000FF' },
    { name: 'Navy Blue', value: 'navy', hexCode: '#000080' },
    { name: 'Green', value: 'green', hexCode: '#008000' },
    { name: 'Olive Green', value: 'olive', hexCode: '#808000' },
    { name: 'Pink', value: 'pink', hexCode: '#FFC0CB' },
    { name: 'Hot Pink', value: 'hot-pink', hexCode: '#FF69B4' },
    { name: 'Purple', value: 'purple', hexCode: '#800080' },
    { name: 'Lavender', value: 'lavender', hexCode: '#E6E6FA' },
    { name: 'Gold', value: 'gold', hexCode: '#FFD700' },
    { name: 'Silver', value: 'silver', hexCode: '#C0C0C0' },
    { name: 'White', value: 'white', hexCode: '#FFFFFF' },
    { name: 'Cream', value: 'cream', hexCode: '#FFFDD0' },
    { name: 'Beige', value: 'beige', hexCode: '#F5F5DC' },
    { name: 'Grey', value: 'grey', hexCode: '#808080' },
    { name: 'Charcoal', value: 'charcoal', hexCode: '#36454F' },
    { name: 'Teal', value: 'teal', hexCode: '#008080' },
    { name: 'Turquoise', value: 'turquoise', hexCode: '#40E0D0' },
    { name: 'Coral', value: 'coral', hexCode: '#FF7F50' },
    { name: 'Maroon', value: 'maroon', hexCode: '#800000' },
    { name: 'Mustard', value: 'mustard', hexCode: '#FFDB58' }
  ];

  const getColorHex = (colorName) => {
    const found = predefinedColors.find(c => 
      c.name.toLowerCase() === colorName?.toLowerCase() ||
      c.value === colorName?.toLowerCase()
    );
    return found ? found.hexCode : '#CCCCCC';
  };

  if (loading && colors.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Colors</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage product colors for your handbag store
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-secondary transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Color
        </button>
      </div>

      {/* Add/Edit Color Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingColor ? 'Edit Color' : 'Add New Color'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value;
                  setFormData({ 
                    ...formData, 
                    name: name,
                    value: name.toLowerCase().replace(/\s+/g, '-')
                  });
                }}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g., Royal Blue, Cherry Red"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Value (slug)
              </label>
              <input
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary bg-gray-50"
                placeholder="royal-blue, cherry-red"
              />
              <p className="text-xs text-gray-500 mt-1">Used for URL filtering (auto-generated from name)</p>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Code (Hex)
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-16 h-10 rounded-lg border shadow cursor-pointer transition-transform hover:scale-105"
                  style={{ backgroundColor: formData.hexCode }}
                />
                <input
                  type="text"
                  value={formData.hexCode}
                  onChange={(e) => setFormData({ ...formData, hexCode: e.target.value })}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary font-mono"
                  placeholder="#000000"
                />
              </div>
              {showColorPicker && (
                <div className="absolute z-50 mt-2">
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setShowColorPicker(false)}
                  />
                  <ChromePicker
                    color={formData.hexCode}
                    onChange={(color) => setFormData({ ...formData, hexCode: color.hex })}
                  />
                </div>
              )}
            </div>

            {/* Quick Color Palette */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Color Palette
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-gray-50">
                {predefinedColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      setFormData({ 
                        name: color.name, 
                        value: color.value,
                        hexCode: color.hexCode,
                        isActive: true 
                      });
                      setShowColorPicker(false);
                    }}
                    className="group relative"
                  >
                    <div 
                      className="w-10 h-10 rounded-full border-2 shadow-md transition-transform hover:scale-110 cursor-pointer mx-auto"
                      style={{ 
                        backgroundColor: color.hexCode,
                        borderColor: formData.hexCode === color.hexCode ? '#C4A484' : '#E5E7EB'
                      }}
                      title={color.name}
                    />
                    <span className="text-xs text-gray-600 mt-1 block text-center truncate max-w-12">
                      {color.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2 w-4 h-4"
                id="colorActive"
              />
              <label htmlFor="colorActive" className="text-sm text-gray-700">
                Active (show in product form)
              </label>
            </div>

            {/* Live Preview */}
            <div className="border-t pt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Live Preview</label>
              <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div 
                  className="w-16 h-16 rounded-xl border-2 shadow-lg transition-all"
                  style={{ 
                    backgroundColor: formData.hexCode,
                    borderColor: '#C4A484'
                  }}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: formData.hexCode }}
                    />
                    <span className="text-gray-800 font-semibold text-lg">
                      {formData.name || 'Color Name'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    Hex: <span className="font-mono">{formData.hexCode}</span>
                  </p>
                  <p className="text-gray-500 text-sm">
                    Slug: <span className="font-mono">{formData.value || 'color-slug'}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : (editingColor ? 'Update Color' : 'Add Color')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Total Colors</p>
          <p className="text-2xl font-bold">{colors.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Active Colors</p>
          <p className="text-2xl font-bold text-green-600">
            {colors.filter(c => c.isActive !== false).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-500 text-sm">Inactive Colors</p>
          <p className="text-2xl font-bold text-red-600">
            {colors.filter(c => c.isActive === false).length}
          </p>
        </div>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div 
            key={color.id} 
            className={`bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-lg ${
              color.isActive === false ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-12 h-12 rounded-lg border-2 shadow-sm transition-transform group-hover:scale-105"
                style={{ 
                  backgroundColor: color.hexCode || getColorHex(color.name),
                  borderColor: '#C4A484'
                }}
              />
              <div>
                <h4 className="font-medium text-gray-800 capitalize">{color.name}</h4>
                <p className="text-sm text-gray-500">{color.value}</p>
                <p className="text-xs text-gray-400 font-mono">
                  {color.hexCode || getColorHex(color.name)}
                </p>
                {color.isActive === false && (
                  <span className="text-xs text-red-500">Inactive</span>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleToggleActive(color)}
                className={`p-2 rounded-lg transition-colors ${
                  color.isActive !== false
                    ? 'text-green-600 hover:bg-green-50' 
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
                title={color.isActive !== false ? 'Deactivate' : 'Activate'}
              >
                {color.isActive !== false ? <FaEye /> : <FaEyeSlash />}
              </button>
              <button
                onClick={() => handleEdit(color)}
                className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                title="Edit"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(color.id)}
                className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Delete"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {colors.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <FaPalette className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No colors added yet</p>
          <p className="text-gray-400">Click "Add Color" to create your first color</p>
        </div>
      )}
    </div>
  );
}

export default AdminColors;
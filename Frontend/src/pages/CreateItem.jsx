import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ITEM_CATEGORIES = ['books', 'electronics', 'furniture', 'clothing', 'other'];
const ITEM_TYPES = ['buy', 'sell', 'donate'];

const CreateItem = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: '',
    image: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/api/marketplace/items', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Item created:', response.data);
      navigate('/marketplace');
    } catch (err) {
      console.error('Error creating item:', err.response);
      setError(err.response?.data?.message || 'Error creating item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-lg bg-gray-900 bg-opacity-80 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-yellow-300 text-center">Create New Item</h2>
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-gray-300">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
                placeholder="Item title"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
                placeholder="Item description"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Price</label>
              <input
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
                placeholder="Item price"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              >
                <option value="">Select Category</option>
                {ITEM_CATEGORIES.map((cat, idx) => (
                  <option key={idx} value={cat} className="bg-gray-800 text-white">
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                required
              >
                <option value="">Select Type</option>
                {ITEM_TYPES.map((type, idx) => (
                  <option key={idx} value={type} className="bg-gray-800 text-white">
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-gray-300">Image</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white"
                accept="image/*"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Item'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateItem;

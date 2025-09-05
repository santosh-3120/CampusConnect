import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from '../components/common/Toast';
import { getItemById, updateItem } from '../features/marketplace/marketplaceAPI';

const EditItem = () => {
  const { id } = useParams(); // item._id from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Fetch existing item
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(id);
        setFormData(data);
      } catch (err) {
        setError('Failed to load item details.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Submit updated item
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItem(id, formData);
      navigate('/marketplace/dashboard'); // redirect back to dashboard
    } catch (err) {
      setError('Failed to update item.');
    }
  };

  if (loading) return <p className="text-center text-gray-300">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-yellow-300">Edit Item</h2>

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          rows="4"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="text"
          name="type"
          placeholder="Type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          className="w-full py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400"
        >
          Update Item
        </button>

        {error && <Toast message={error} type="error" />}
      </form>
    </div>
  );
};

export default EditItem;

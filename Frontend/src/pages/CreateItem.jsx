import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useItem, useItemActions } from '../features/marketplace/marketplaceHooks';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const CreateItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading } = useItem(id);
  const { createItem, updateItem, error } = useItemActions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    type: 'sale',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (item && id) {
      setFormData({
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        type: item.type,
      });
    }
  }, [item, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (imageFile) data.append('image', imageFile);

    try {
      if (id) {
        await updateItem(id, data);
      } else {
        await createItem(data);
      }
      navigate('/marketplace');
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{id ? 'Edit Item' : 'Create Item'}</h1>
        {error && <Toast message={error} type="error" />}
        <div className="card p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className="input-field">
                <option value="sale">Sale</option>
                <option value="donation">Donation</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-primary w-full">Save</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItem;
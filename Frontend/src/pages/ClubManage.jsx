import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useClub, useClubActions } from '../features/clubs/clubsHooks';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const ClubManage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { club, loading, error } = useClub(id);
  const { createClub, updateClub, error: actionError } = useClubActions();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contactEmail: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (club && id) {
      setFormData({
        name: club.name,
        description: club.description,
        contactEmail: club.contactEmail || '',
      });
    }
  }, [club, id]);

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
        await updateClub(id, data);
      } else {
        await createClub(data);
      }
      navigate('/clubs');
    } catch (err) {
      console.error('Error saving club:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{id ? 'Edit Club' : 'Create Club'}</h1>
        {error && <Toast message={error} type="error" />}
        {actionError && <Toast message={actionError} type="error" />}
        <div className="card p-6 max-w-md mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Club Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
              <label className="block text-gray-700 mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Club Image</label>
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

export default ClubManage;
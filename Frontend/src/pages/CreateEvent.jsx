import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useEventActions } from '../features/events/eventsHooks';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, loading } = useEvent(id);
  const { createEvent, updateEvent, error } = useEventActions();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    organizer: '',
  });
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (event && id) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        organizer: event.organizer || '',
      });
    }
  }, [event, id]);

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
        await updateEvent(id, data);
      } else {
        await createEvent(data);
      }
      navigate('/events');
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{id ? 'Edit Event' : 'Create Event'}</h1>
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
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Organizer</label>
              <input
                type="text"
                name="organizer"
                value={formData.organizer}
                onChange={handleChange}
                className="input-field"
              />
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

export default CreateEvent;
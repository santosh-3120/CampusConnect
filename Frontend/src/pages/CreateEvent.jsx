import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvent, useEventActions } from '../features/events/eventsHooks';
import { AuthContext } from '../context/AuthContext';
import InputField from '../components/common/InputField';
import Textarea from '../components/common/Textarea';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';

const CreateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { event, loading: eventLoading } = id ? useEvent(id) : { event: null, loading: false };
  const { createEvent, updateEvent, loading, error } = useEventActions();
  const { user } = useContext(AuthContext);

  const [showErrorToast, setShowErrorToast] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
  });

  const isAdmin = user?.role === 'admin' || user?.role === 'club_coordinator';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/events');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
      });
      setImagePreview(event.image || null);
    }
  }, [event]);

  useEffect(() => {
    if (error) {
      setErrorMessage(error);
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      const maxSize = 5 * 1024 * 1024;
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Please upload a valid image (JPEG, PNG, GIF).');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
        return;
      }
      if (file.size > maxSize) {
        setErrorMessage('Image size must be less than 5MB.');
        setShowErrorToast(true);
        setTimeout(() => setShowErrorToast(false), 3000);
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile && !id) {
      setErrorMessage('Please upload an event image.');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
      return;
    }

    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('date', formData.date);
    formPayload.append('location', formData.location);

    if (imageFile && imageFile instanceof File) {
      formPayload.append('image', imageFile);
    }

    try {
      if (id) {
        await updateEvent(id, formPayload);
      } else {
        await createEvent(formPayload);
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        setShowSuccessToast(false);
        navigate('/events');
      }, 3000);

      setImageFile(null);
      setImagePreview(null);
      setFormData({ title: '', description: '', date: '', location: '' });
    } catch (err) {
      setErrorMessage(err.message || 'Server error');
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  };

  if (!isAdmin) return null;
  if (eventLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Edit Event' : 'Create Event'}
        </h1>

        {showErrorToast && (
          <Toast
            message={errorMessage}
            type="error"
            onClose={() => setShowErrorToast(false)}
          />
        )}
        {showSuccessToast && (
          <Toast
            message={id ? 'Event updated successfully!' : 'Event created successfully!'}
            type="info"
            onClose={() => setShowSuccessToast(false)}
          />
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-6 shadow-sm backdrop-blur-md space-y-6"
        >
          <InputField
            label="Title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            rows="4"
          />

          <InputField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <InputField
            label="Location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-600 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="space-y-1">
            <label htmlFor="event-image" className="block text-sm font-medium text-gray-100">
              Event Image {id ? '(Optional)' : '(Required)'}
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="event-image"
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-base hover:bg-gray-600 text-gray-100 shadow-sm cursor-pointer"
              >
                Upload Image
                <input
                  id="event-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required={!id}
                />
              </label>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 rounded-lg text-white border border-gray-600 shadow-sm ${
              loading ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
            } transition`}
          >
            {loading ? 'Saving...' : id ? 'Update Event' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;

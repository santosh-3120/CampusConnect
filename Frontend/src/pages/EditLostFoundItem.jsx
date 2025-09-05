import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Toast } from '../components/common/Toast';
import { useLostFoundItem, useUpdateLostFoundItem } from '../features/lostAndFound/lostFoundHooks';

// Convert ISO date to datetime-local
const toDateTimeLocal = (dateVal) => {
  if (!dateVal) return '';
  const dt = new Date(dateVal);
  if (isNaN(dt.getTime())) return '';
  const tzOffset = dt.getTimezoneOffset() * 60000;
  return new Date(dt - tzOffset).toISOString().slice(0, 16);
};

const EditLostFoundItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { item, loading: isLoading, error: fetchError } = useLostFoundItem(id);
  const { updateLostFoundItem, loading: updateLoading, error: updateError } = useUpdateLostFoundItem();

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    status: '',
    date: '',
    handoverTo: '',
    handoverLocation: '',
    image: null,
  });

  // Populate form with existing item data
  useEffect(() => {
    if (item) {
      setFormData({
        itemName: item.itemName || '',
        description: item.description || '',
        location: item.location || '',
        status: item.status || '',
        date: item.date ? toDateTimeLocal(item.date) : '',
        handoverTo: item.handoverTo || '',
        handoverLocation: item.handoverLocation || '',
        image: null,
      });
    }
  }, [item]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateLostFoundItem(id, formData); // ✅ use hook function
      navigate('/lost-and-found');
    } catch (err) {
      console.error('Update error:', err);
    }
  };

  if (isLoading) return <p className="text-center text-gray-300">Loading...</p>;
  if (!item) return <p className="text-center text-gray-300">Item not found</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-xl shadow-lg w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-yellow-300">Edit Lost/Found Item</h2>

        <input
          type="text"
          name="itemName"
          placeholder="Item Name"
          value={formData.itemName}
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
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        >
          <option value="" disabled>Select Status</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <input
          type="datetime-local"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
          required
        />

        <input
          type="text"
          name="handoverTo"
          placeholder="Handover To"
          value={formData.handoverTo}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="text"
          name="handoverLocation"
          placeholder="Handover Location"
          value={formData.handoverLocation}
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full p-2 rounded bg-gray-800 text-white"
        />

        <button
          type="submit"
          disabled={updateLoading}
          className="w-full py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400 disabled:bg-gray-500"
        >
          {updateLoading ? 'Updating...' : 'Update Item'}
        </button>

        {(fetchError || updateError) && (
          <Toast message={fetchError || updateError} type="error" />
        )}
      </form>
    </div>
  );
};

export default EditLostFoundItem;

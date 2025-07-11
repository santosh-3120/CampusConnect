import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import InputField from '../components/common/InputField';
import Textarea from '../components/common/Textarea';
import Select from '../components/common/Select';
import FileInput from '../components/common/FileInput';
import Button from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { useLostFoundItem, createItem, updateItem } from '../features/lostAndFound/lostFoundHooks';

const CreateLostFound = () => {
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const { item, loading } = useLostFoundItem(id);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    location: '',
    status: 'lost',
    date: '',
    handoverTo: '',
    handoverLocation: '',
    image: null,
  });

  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (isEdit && !loading && item) {
      setFormData({
        itemName: item.itemName || '',
        description: item.description || '',
        location: item.location || '',
        status: item.status || 'lost',
        date: new Date(item.date).toISOString().slice(0, 16),
        handoverTo: item.handoverTo || '',
        handoverLocation: item.handoverLocation || '',
        image: null,
      });
    }
  }, [item, isEdit, loading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateItem(id, formData);
        setToast({ message: 'Item updated successfully', type: 'success' });
        navigate(`/lost-and-found/${id}`);
      } else {
        await createItem(formData);
        setToast({ message: 'Item created successfully', type: 'success' });
        navigate('/lost-and-found');
      }
    } catch (err) {
      setError(err.message || `Failed to ${isEdit ? 'update' : 'create'} item`);
      setToast({
        message: err.message || `Failed to ${isEdit ? 'update' : 'create'} item`,
        type: 'error',
      });
    }
  };

  if (isEdit && loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  // ✅ Consistent input styling for dark background
  const inputClassName = "text-white bg-gray-800 border border-gray-600 placeholder-gray-400";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <Navbar user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h2 className="text-3xl font-extrabold text-yellow-300 mb-6">
          {isEdit ? 'Edit Item' : 'Post a Lost or Found Item'}
        </h2>

        {error && <Toast message={error} type="error" onClose={() => setToast(null)} />}

        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-6 max-w-lg mx-auto"
        >
          <InputField
            label="Item Name"
            id="itemName"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <Textarea
            label="Description"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={inputClassName}
          />
          <InputField
            label="Location"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <Select
            label="Status"
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={[
              { value: 'lost', label: 'Lost' },
              { value: 'found', label: 'Found' },
            ]}
            className={inputClassName}
          />
          <InputField
            label="Date"
            id="date"
            name="date"
            type="datetime-local"
            value={formData.date}
            onChange={handleChange}
            required
            className={inputClassName}
          />
          <InputField
            label="Handover To (if found)"
            id="handoverTo"
            name="handoverTo"
            value={formData.handoverTo}
            onChange={handleChange}
            className={inputClassName}
          />
          <InputField
            label="Handover Location (if found)"
            id="handoverLocation"
            name="handoverLocation"
            value={formData.handoverLocation}
            onChange={handleChange}
            className={inputClassName}
          />
          <FileInput
            label="Image"
            id="image"
            name="image"
            onChange={handleImageChange}
            accept="image/*"
            className="text-white"
          />
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
            {isEdit ? 'Update Item' : 'Post Item'}
          </Button>
        </form>
      </div>

      <Footer />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CreateLostFound;

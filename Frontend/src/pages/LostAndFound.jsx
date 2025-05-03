import React from 'react';
import { Link } from 'react-router-dom';
import { useLostFoundItems, useLostFoundActions } from '../features/lostAndFound/lostFoundHooks';
import Navbar from '../components/layout/Navbar';
import LostFoundCard from '../components/lostAndFound/LostFoundCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const LostAndFound = () => {
  const { items, loading, error } = useLostFoundItems();
  const { deleteItem } = useLostFoundActions();

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Lost & Found</h1>
          <Link to="/lost-and-found/create" className="btn-primary">Post Item</Link>
        </div>
        {error && <Toast message={error} type="error" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <LostFoundCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LostAndFound;
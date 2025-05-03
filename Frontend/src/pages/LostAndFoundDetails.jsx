import React from 'react';
import { useParams } from 'react-router-dom';
import { useLostFoundItem, useLostFoundActions } from '../features/lostAndFound/lostFoundHooks';
import Navbar from '../components/layout/Navbar';
import LostFoundCard from '../components/lostAndFound/LostFoundCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const LostAndFoundDetails = () => {
  const { id } = useParams();
  const { item, loading, error } = useLostFoundItem(id);
  const { deleteItem } = useLostFoundActions();

  const handleDelete = async () => {
    try {
      await deleteItem(id);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (loading) return <Spinner />;
  if (!item) return <div className="text-center text-red-500">Item not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        {error && <Toast message={error} type="error" />}
        <LostFoundCard item={item} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default LostAndFoundDetails;
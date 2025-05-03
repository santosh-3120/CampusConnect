import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItems, useItemActions } from '../features/marketplace/marketplaceHooks';
import Navbar from '../components/layout/Navbar';
import ItemCard from '../components/marketplace/ItemCard';
import ItemFilter from '../components/marketplace/ItemFilter';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const Marketplace = () => {
  const [filters, setFilters] = useState({});
  const { items, loading, error } = useItems(filters);
  const { deleteItem } = useItemActions();

  const handleFilter = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <div className="flex space-x-2">
            <Link to="/marketplace/create" className="btn-primary">Post Item</Link>
            <Link to="/marketplace/dashboard" className="btn-secondary">My Dashboard</Link>
          </div>
        </div>
        {error && <Toast message={error} type="error" />}
        <ItemFilter onFilter={handleFilter} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
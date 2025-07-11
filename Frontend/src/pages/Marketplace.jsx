import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useItems } from '../features/marketplace/marketplaceHooks';
import ItemCard from '../components/marketplace/ItemCard';
import ItemFilter from '../components/marketplace/ItemFilter';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';

const Marketplace = () => {
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useItems(filters);
  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 text-white py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header with Sell and Dashboard Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-4xl font-extrabold text-yellow-300">Marketplace</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate('/marketplace/create')}
              className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded-lg font-semibold transition"
            >
              Sell Item
            </button>
            <button
              onClick={() => navigate('/marketplace/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-semibold transition"
            >
              Dashboard
            </button>
          </div>
        </div>

        {/* Filter component */}
        <div className="mb-6">
          <ItemFilter onFilter={handleFilter} />
        </div>

        {/* Loading Spinner */}
        {isLoading && <Spinner />}

        {/* Error Toast */}
        {error && <Toast message={error} type="error" />}

        {/* Items grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.length === 0 ? (
              <p className="col-span-full text-center text-gray-300 text-lg mt-8">No items found.</p>
            ) : (
              items.map((item) => <ItemCard key={item._id} item={item} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;

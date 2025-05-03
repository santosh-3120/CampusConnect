import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ For navigation
import { useItems } from '../features/marketplace/marketplaceHooks';
import ItemCard from '../components/marketplace/ItemCard';
import ItemFilter from '../components/marketplace/ItemFilter';
import {Spinner} from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';

const Marketplace = () => {
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useItems(filters);
  const navigate = useNavigate();

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header with Sell Button */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <button
          onClick={() => navigate('/marketplace/create')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Sell Item
        </button>
        <button
            onClick={() => navigate('/marketplace/dashboard')}  // Assuming the dashboard route is '/dashboard'
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Dashboard
          </button>
      </div>

      {/* Filter component */}
      <ItemFilter onFilter={handleFilter} />

      {/* Loading Spinner */}
      {isLoading && <Spinner />}

      {/* Error Toast */}
      {error && <Toast message={error} type="error" />}

      {/* Items grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">No items found.</p>
          ) : (
            items.map((item) => <ItemCard key={item._id} item={item} />)
          )}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useItemById } from '../features/marketplace/marketplaceHooks';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';

const MarketplaceItem = () => {
  const { id } = useParams();
  const { item, isLoading, error } = useItemById(id);

  if (isLoading) return <Spinner />;
  if (error) return <Toast message={error} type="error" />;
  if (!item)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white">
        <p className="text-lg">Item not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/marketplace"
          className="text-yellow-300 hover:underline mb-6 inline-block"
        >
          &larr; Back to Marketplace
        </Link>

        {/* Example filter with custom select */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold">Filter by Category</label>
          <select className="w-full bg-gray-800 text-white p-3 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
            <option value="">All Categories</option>
            <option value="books">Books</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
          </select>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-64 object-cover rounded mb-6"
          />
          <h1 className="text-3xl font-bold mb-3 text-yellow-300">{item.title}</h1>
          <p className="text-gray-300 mb-6">{item.description}</p>
          <p className="text-green-400 font-bold text-2xl mb-4">₹{item.price}</p>
          <p className="text-sm text-gray-400 mb-1">Category: {item.category}</p>
          <p className="text-sm text-gray-400 mb-1">Type: {item.type}</p>
          <p className="text-sm text-gray-400 mb-1">Status: {item.status}</p>
          <p className="text-sm text-gray-400">Posted by: {item.user?.name || 'Unknown'}</p>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceItem;

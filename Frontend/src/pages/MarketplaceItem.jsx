import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useItemById } from '../features/marketplace/marketplaceHooks';
import {Spinner}  from '../components/common/Spinner'; // Changed to named import
import { Toast } from '../components/common/Toast'; // Named import for consistency

const MarketplaceItem = () => {
  const { id } = useParams();
  const { item, isLoading, error } = useItemById(id);

  if (isLoading) return <Spinner />;
  if (error) return <Toast message={error} type="error" />;
  if (!item) return <div className="container mx-auto p-4">Item not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/marketplace" className="text-blue-600 hover:underline mb-4 inline-block">
        &larr; Back to Marketplace
      </Link>
      <div className="bg-white border rounded-lg shadow-md p-6">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full h-64 object-cover rounded mb-4"
        />
        <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
        <p className="text-gray-600 mb-4">{item.description}</p>
        <p className="text-green-600 font-bold text-xl mb-2">₹{item.price}</p>
        <p className="text-sm text-gray-500 mb-1">Category: {item.category}</p>
        <p className="text-sm text-gray-500 mb-1">Type: {item.type}</p>
        <p className="text-sm text-gray-500 mb-1">Status: {item.status}</p>
        <p className="text-sm text-gray-500">Posted by: {item.user?.name || 'Unknown'}</p>
      </div>
    </div>
  );
};

export default MarketplaceItem;
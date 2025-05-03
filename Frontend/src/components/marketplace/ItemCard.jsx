import React from 'react';
import { Link } from 'react-router-dom';
import { useMarkAsSold } from '../../features/marketplace/marketplaceHooks';
import { Toast } from '../common/Toast'; // Changed to named import

const ItemCard = ({ item, isDashboard = false }) => {
  const { markAsSold, isLoading, error } = useMarkAsSold();

  const handleMarkAsSold = async () => {
    await markAsSold(item._id);
  };

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white">
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-48 object-cover rounded mb-4"
      />
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <p className="text-gray-600">{item.description.substring(0, 100)}...</p>
      <p className="text-green-600 font-bold">₹{item.price}</p>
      <p className="text-sm text-gray-500">Category: {item.category}</p>
      <p className="text-sm text-gray-500">Type: {item.type}</p>
      <p className="text-sm text-gray-500">Status: {item.status}</p>
      {isDashboard ? (
        <div className="mt-4 flex space-x-2">
          <Link
            to={`/marketplace/edit/${item._id}`}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </Link>
          {item.status !== 'Sold' && (
            <button
              onClick={handleMarkAsSold}
              disabled={isLoading}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? 'Marking...' : 'Mark as Sold'}
            </button>
          )}
        </div>
      ) : (
        <Link
          to={`/marketplace/${item._id}`}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View Details
        </Link>
      )}
      {error && <Toast message={error} type="error" />}
    </div>
  );
};

export default ItemCard;
import React from 'react';
import { Link } from 'react-router-dom';
import { Toast } from '../common/Toast';

const ItemCard = ({ item, isDashboard = false, onMarkAsSold, isLoading, error }) => {
  // fallback image if item.imageUrl is missing or broken
  const fallbackImage = 'https://placehold.co/300x160?text=No+Image';

  return (
    <div className="bg-gray-800/90 rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col w-[350px]">
      <img
        src={item.imageUrl || fallbackImage}
        alt={item.title}
        className="w-full h-40 object-cover rounded-t-lg mb-4"
        onError={(e) => {
          if (e.target.src !== fallbackImage) {
            e.target.src = fallbackImage;
          }
        }}
      />
      <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
      <p className="text-gray-400 mt-1 line-clamp-3">{item.description}</p>
      <p className="text-green-400 font-bold mt-2">₹{item.price}</p>
      <p className="text-sm text-gray-300 mt-1">Category: {item.category}</p>
      <p className="text-sm text-gray-300">Type: {item.type}</p>
      <p className="text-sm text-gray-300">Status: {item.status}</p>

      {isDashboard ? (
        <div className="mt-4 flex space-x-3">
          <Link
            to={`/marketplace/edit/${item._id}`}
            className="text-yellow-400 hover:underline text-sm"
          >
            Edit
          </Link>
          {item.status !== 'Sold' && (
            <button
              onClick={() => onMarkAsSold(item._id)}
              disabled={isLoading}
              className="text-red-400 hover:underline text-sm disabled:opacity-50"
            >
              {isLoading ? 'Marking...' : 'Mark as Sold'}
            </button>
          )}
        </div>
      ) : (
        <Link
          to={`/marketplace/${item._id}`}
          className="mt-4 inline-block text-green-400 font-medium hover:underline text-sm"
        >
          View Details
        </Link>
      )}
      {error && <Toast message={error} type="error" />}
    </div>
  );
};

export default ItemCard;

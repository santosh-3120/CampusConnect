import React from 'react';
import { useNavigate } from 'react-router-dom';
import {Spinner} from '../components/common/Spinner';
import ItemCard from '../components/marketplace/ItemCard';
import { Toast } from '../components/common/Toast';
import { useUserItems, useMarkAsSold } from '../features/marketplace/marketplaceHooks';

const MarketplaceDashboard = () => {
  const { items, isLoading, error } = useUserItems();
  const { markAsSold, isLoading: markSoldIsLoading, error: markSoldError } = useMarkAsSold();
  const navigate = useNavigate();

  const handleMarkAsSold = async (itemId) => {
    try {
      await markAsSold(itemId);
      // Update the state so the UI reflects the change
      setItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? { ...item, status: 'Sold' } : item
        )
      );
    } catch (err) {
      console.error('Error marking item as sold:', err);
    }
  };
  

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Items</h1>

      {/* Loading Spinner */}
      {isLoading && <Spinner />}

      {/* Error Toast */}
      {(error || markSoldError) && <Toast message={error || markSoldError} type="error" />}

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No items found.</p>
        ) : (
          items.map(item => (
            <div key={item._id} className="relative">
              <ItemCard item={item} />
              {/* Only allow the user to mark the item as sold if it is available */}
              {item.status !== 'Sold' && (
                <button
                  onClick={() => handleMarkAsSold(item._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  disabled={markSoldIsLoading}
                >
                  {markSoldIsLoading ? 'Processing...' : 'Mark as Sold'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MarketplaceDashboard;
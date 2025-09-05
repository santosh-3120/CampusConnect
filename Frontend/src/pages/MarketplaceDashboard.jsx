import React, { useState, useEffect, useContext } from 'react';
import { Spinner } from '../components/common/Spinner';
import ItemCard from '../components/marketplace/ItemCard';
import { Toast } from '../components/common/Toast';
import { useUserItems, useMarkAsSold } from '../features/marketplace/marketplaceHooks';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthContext } from '../context/AuthContext';

const MarketplaceDashboard = () => {
  const { items, isLoading, error } = useUserItems();
  const { markAsSold, isLoading: markSoldIsLoading, error: markSoldError } = useMarkAsSold();
  const [localItems, setLocalItems] = useState([]);

  const { user, logout } = useContext(AuthContext);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleMarkAsSold = async (itemId) => {
     console.log("Mark as sold request ID:", itemId);
    try {
      const updatedItem = await markAsSold(itemId); // ✅ get updated item from API
      setLocalItems(prevItems =>
        prevItems.map(item =>
          item._id === itemId ? updatedItem : item // ✅ replace with server response
        )
      );
    } catch (err) {
      console.error('Error marking item as sold:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      
      {/* ✅ Navbar */}
      <Navbar user={user} logout={logout} />

      <main className="max-w-7xl mx-auto px-4 py-8 flex-grow">
        <h1 className="text-4xl font-extrabold mb-6 text-yellow-300">My Items</h1>

        {isLoading && <Spinner />}

        {(error || markSoldError) && <Toast message={error || markSoldError} type="error" />}
        {markSoldIsLoading && <Toast message="Updating item status..." type="info" />}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {localItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-300 text-lg mt-8">
              No items found.
            </p>
          ) : (
            localItems.map(item => (
              <div key={item._id} className="relative bg-gray-800 rounded-lg shadow-lg p-4">
                <ItemCard item={item} isDashboard={true} onMarkAsSold={handleMarkAsSold} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* ✅ Footer */}
      <Footer />
    </div>
  );
};

export default MarketplaceDashboard;

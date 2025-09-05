import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useItems } from '../features/marketplace/marketplaceHooks';
import ItemCard from '../components/marketplace/ItemCard';
import ItemFilter from '../components/marketplace/ItemFilter';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { AuthContext } from '../context/AuthContext';   // ✅ added

const Marketplace = () => {
  const [filters, setFilters] = useState({});
  const { items, isLoading, error } = useItems(filters);
  const navigate = useNavigate();

  // ✅ get user and logout from context
  const { user, logout } = useContext(AuthContext);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 text-white">
      
      {/* ✅ pass user and logout to Navbar */}
      <Navbar user={user} logout={logout} />

      <main className="w-7xl mx-auto flex flex-col px-4 sm:px-6 lg:px-8 py-8 ">
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
              My Items
            </button>
          </div>
        </div>

        {/* Filter component */}
        <div className="mb-6">
          <ItemFilter onFilter={handleFilter} />
        </div>

        {/* Error Toast */}
        {error && <Toast message={error} type="error" />}

        {/* Items grid */}
        {!isLoading && !error ? (
          <div className="flex flex-wrap gap-10 items-center justify-center">
            {items.length === 0 ? (
              <p className="col-span-full text-center text-gray-300 text-lg mt-8">
                No items found.
              </p>
            ) : (
              items.map((item) => <ItemCard key={item._id} item={item} />)
            )}
          </div>
        ):
        (
          <Spinner/>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Marketplace;

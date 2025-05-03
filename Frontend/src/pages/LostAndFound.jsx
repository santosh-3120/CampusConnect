import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LostFoundFilter from '../components/lostAndFound/LostFoundFilter';
import LostFoundCard from '../components/lostAndFound/LostFoundCard';
import Toast from '../components/common/Toast';
import { useLostFoundItems } from '../features/lostAndFound/lostFoundHooks';

const LostAndFound = () => {
  const { user, logout } = useContext(AuthContext);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const { items, loading, error } = useLostFoundItems();
  const [toast, setToast] = useState(null);

  const filteredItems = items.filter((item) => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.itemName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-blue-50 font-sans flex flex-col">
      <Navbar user={user} logout={logout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Lost & Found</h2>
          <Link
            to="/lost-and-found/new"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Post New Item
          </Link>
        </div>
        <LostFoundFilter filter={filter} setFilter={setFilter} search={search} setSearch={setSearch} />
        {error && <Toast message={error} type="error" onClose={() => setToast(null)} />}
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : filteredItems.length === 0 ? (
          <p className="text-gray-600 text-center">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <LostFoundCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LostAndFound;
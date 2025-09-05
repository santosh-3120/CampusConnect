import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FaChartLine, FaUsers, FaShoppingCart, FaComments, FaCalendarAlt } from 'react-icons/fa';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CampusConnect Hub</h1>
          <div className="space-x-4">
            <button onClick={toggleModal} className="hover:text-yellow-300">
              {user.name}
            </button>
            <button onClick={logout} className="hover:text-yellow-300">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-sm">{user.role}</p>
            <p className="text-sm mt-2">{user.email}</p>
            <button
              onClick={toggleModal}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-4xl font-extrabold mb-8 text-yellow-300">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/events"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaCalendarAlt className="text-3xl text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Events</h3>
            <p>Check out campus events and RSVP.</p>
          </Link>
          <Link
            to="/marketplace"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaShoppingCart className="text-3xl text-green-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Marketplace</h3>
            <p>Buy, sell, or trade items.</p>
          </Link>
          <Link
            to="/lost-and-found"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaUsers className="text-3xl text-red-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lost & Found</h3>
            <p>Report or find lost items.</p>
          </Link>
          <Link
            to="/clubs"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaUsers className="text-3xl text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Clubs</h3>
            <p>Join or explore student clubs.</p>
          </Link>
          <Link
            to="/chats"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaComments className="text-3xl text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Messages</h3>
            <p>Connect with your peers.</p>
          </Link>
          <a
            href="https://www.indeed.com" // change to preferred job portal URL
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            <FaChartLine className="text-3xl text-teal-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Jobs</h3>
            <p>Explore career opportunities.</p>
          </a>
        </div>
      </main>

      <footer className="bg-gray-900 p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

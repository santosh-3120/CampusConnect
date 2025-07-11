import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, logout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4 text-white">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold hover:text-yellow-300">
            CampusConnect Hub
          </Link>
          <div className="space-x-4 flex items-center">
            <button
              onClick={toggleModal}
              className="hover:text-yellow-300 font-medium"
            >
              {user?.name}
            </button>
            <button
              onClick={logout}
              className="hover:text-yellow-300 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold">{user?.name}</h3>
            <p className="text-sm">{user?.role}</p>
            <p className="text-sm mt-2">{user?.email}</p>
            <button
              onClick={toggleModal}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

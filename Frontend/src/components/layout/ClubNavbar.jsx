import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

function ClubClubNavbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl text-white font-bold hover:text-yellow-300">
              CampusConnectClubs
            </Link>
          </div>
          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-white">
                Welcome, {user.name} ({user.role})
              </span>
              <Link
                to="/dashboard"
                className="text-white hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/clubs"
                className="text-white hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Clubs
              </Link>
              {/* {user.role === 'admin' && (
                <Link
                  to="/club-manage"
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Manage Clubs
                </Link>
              )} */}
              <button
                onClick={logout}
                className="text-white hover:text-yellow-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default ClubClubNavbar;
import { Link } from 'react-router-dom';
import logo from '../../assets/react.svg'; // Use vite.svg instead of logo.png

const Navbar = ({ user, logout }) => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <img src={logo} alt="CollegeHub Logo" className="h-10" />
            <span className="ml-2 text-2xl font-bold text-green-600">CollegeHub</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.name} ({user.role})</span>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/lost-and-found"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Lost & Found
            </Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
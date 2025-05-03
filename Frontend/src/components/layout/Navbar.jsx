import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-white shadow-lg fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold">CollegeHub</Link>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Link to="/dashboard" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Dashboard</Link>
                <Link to="/events" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Events</Link>
                <Link to="/marketplace" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Marketplace</Link>
                <Link to="/lost-and-found" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Lost & Found</Link>
                <Link to="/clubs" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Clubs</Link>
                <Link to="/forum" className="hover:bg-indigo-700 px-3 py-2 rounded-md">Forum</Link>
                <button onClick={() => setIsProfileOpen(!isProfileOpen)}>
                  <FaUserCircle className="text-2xl" />
                </button>
                <button onClick={handleLogout} className="hover:bg-indigo-700 px-3 py-2 rounded-md">Logout</button>
              </>
            )}
          </div>
        </div>
      </div>
      {isProfileOpen && user && (
        <div className="fixed top-16 right-4 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64">
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm">Roll No: {user.rollNo}</p>
          <p className="text-sm">Email: {user.email}</p>
          <p className="text-sm">Role: {user.role}</p>
          <Link to="/profile" className="text-indigo-600 hover:underline mt-2 block">View Profile</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">CollegeHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name} ({user.role})</span>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Welcome to CollegeHub</h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto">
            {user.role === 'admin'
              ? 'Manage your college community with powerful admin tools.'
              : 'Connect, collaborate, and explore opportunities with your college community.'}
          </p>
          <a href="#features" className="inline-block bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Explore Our Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Event Hub Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <img src={viteLogo} className="w-16 h-16" alt="Vite logo" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Hub</h3>
                <p className="text-gray-600 mb-4">Discover and RSVP to campus events, from workshops to cultural fests.</p>
                <a href="/events" className="text-green-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>

            {/* Marketplace Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-teal-100 flex items-center justify-center">
                <img src={reactLogo} className="w-16 h-16" alt="React logo" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Marketplace</h3>
                <p className="text-gray-600 mb-4">Buy, sell, or trade items like books, gadgets, and more with peers.</p>
                <a href="/marketplace" className="text-teal-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>

            {/* Lost & Found Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-blue-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lost & Found</h3>
                <p className="text-gray-600 mb-4">Report or find lost items around campus with ease.</p>
                <a href="/lost-and-found" className="text-blue-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>

            {/* Clubs Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-green-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Clubs</h3>
                <p className="text-gray-600 mb-4">Join or follow student clubs to stay updated on activities.</p>
                <a href="/clubs" className="text-green-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>

            {/* Forum Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-yellow-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5v-2a2 2 0 012-2h10a2 2 0 012 2v2h-4M7 4h10a2 2 0 012 2v2H5V6a2 2 0 012-2z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Discussion Forum</h3>
                <p className="text-gray-600 mb-4">Ask questions, share ideas, and connect with the community.</p>
                <a href="/forum" className="text-yellow-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>

            {/* Dashboard Card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
              <div className="h-48 bg-red-100 flex items-center justify-center">
                <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Dashboard</h3>
                <p className="text-gray-600 mb-4">Your personalized hub for all campus activities.</p>
                <a href="/dashboard" className="text-red-600 font-medium hover:underline">Learn More →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">CollegeHub</h3>
              <p className="text-gray-400">Empowering students to connect and thrive in their college journey.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/events" className="text-gray-400 hover:text-white">Events</a></li>
                <li><a href="/marketplace" className="text-gray-400 hover:text-white">Marketplace</a></li>
                <li><a href="/lost-and-found" className="text-gray-400 hover:text-white">Lost & Found</a></li>
                <li><a href="/clubs" className="text-gray-400 hover:text-white">Clubs</a></li>
                <li><a href="/forum" className="text-gray-400 hover:text-white">Forum</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">Email: support@collegehub.com</p>
              <p className="text-gray-400">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center">
            <p className="text-gray-400">© 2025 CollegeHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CampusConnect Hub</h1>
          <div className="space-x-4">
            <Link to="/login" className="hover:text-yellow-300">
              Login
            </Link>
            <Link to="/signup" className="hover:text-yellow-300">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-6">Welcome to CampusConnect</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Dive into a vibrant community hub for events, jobs, and connections!
          </p>
          <div className="space-x-4">
            <Link
              to="/events"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg"
            >
              Explore Events
            </Link>
            <Link
              to="/marketplace"
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg"
            >
              Visit Marketplace
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;

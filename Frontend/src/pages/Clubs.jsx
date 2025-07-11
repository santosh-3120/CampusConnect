import { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useClubs } from '../features/clubs/clubsHooks';
import ClubCard from '../components/clubs/ClubCard';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';

function Clubs() {
  const { clubs, isLoading, error, fetchClubs } = useClubs();
  const { user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  if (isLoading) return <Spinner />;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      {/* Navbar same as Dashboard */}
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CampusConnect Clubs</h1>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-extrabold text-yellow-300">Clubs</h2>
          {user?.role === 'admin' && (
            <Link to="/club-manage">
              <Button className="bg-green-600 hover:bg-green-700">Create Club</Button>
            </Link>
          )}
        </div>

        {error && <Toast message={error} type="error" />}

        {clubs.length === 0 ? (
          <p className="text-gray-200 text-center">No clubs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard key={club._id} club={club} userRole={user?.role} />
            ))}
          </div>
        )}
      </main>

      <footer className="bg-gray-900 p-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-white">
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Clubs;

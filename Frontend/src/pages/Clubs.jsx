import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useClubs } from '../features/clubs/clubsHooks';
import ClubCard from '../components/clubs/ClubCard';
import ClubNavbar from '../components/layout/ClubNavbar';
import {Spinner} from '../components/common/Spinner';
import {Toast} from '../components/common/Toast';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';

function Clubs() {
  const { clubs, isLoading, error, fetchClubs } = useClubs();
  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  if (isLoading || authLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <ClubNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Clubs</h1>
          {user?.role === 'admin' && (
            <Link to="/club-manage">
              <Button className="cursor-pointer"> Create Club</Button>
            </Link>
          )}
        </div>
        {error && <Toast message={error} type="error" />}
        {clubs.length === 0 ? (
          <p className="text-gray-600 text-center">No clubs available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubs.map((club) => (
              <ClubCard key={club._id} club={club} userRole={user?.role} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clubs;
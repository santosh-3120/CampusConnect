import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useClubs, useClubActions } from '../features/clubs/clubsHooks';
import Navbar from '../components/layout/Navbar';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const Clubs = () => {
  const { user } = useContext(AuthContext);
  const { clubs, loading, error } = useClubs();
  const { joinClub, leaveClub, error: actionError } = useClubActions();

  const handleJoin = async (clubId) => {
    try {
      await joinClub(clubId);
    } catch (err) {
      console.error('Error joining club:', err);
    }
  };

  const handleLeave = async (clubId) => {
    try {
      await leaveClub(clubId);
    } catch (err) {
      console.error('Error leaving club:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Clubs</h1>
        {error && <Toast message={error} type="error" />}
        {actionError && <Toast message={actionError} type="error" />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club._id} className="card p-6">
              <img
                src={club.image || 'https://placehold.co/600x400?text=Club'}
                alt={club.name}
                className="post-image mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800">{club.name}</h2>
              <p className="text-gray-600 mt-2">{club.description}</p>
              <p className="text-sm text-gray-500 mt-2">Members: {club.members.length}</p>
              <div className="mt-4 flex space-x-2">
                <Link to={`/clubs/${club._id}`} className="btn-primary">View Details</Link>
                {user && club.members.includes(user._id) ? (
                  <button onClick={() => handleLeave(club._id)} className="btn-secondary">Leave</button>
                ) : (
                  <button onClick={() => handleJoin(club._id)} className="btn-primary">Join</button>
                )}
                {(user?.role === 'admin' || user?.role === 'club_coordinator') && (
                  <Link to={`/club-manage/${club._id}`} className="btn-secondary">Manage</Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Clubs;
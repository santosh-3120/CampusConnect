import { Link } from 'react-router-dom';

function ClubCard({ club, userRole }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="h-48">
        {club.logo ? (
          <img
            src={club.logo}
            alt={`${club.name} logo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">No Logo</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{club.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
        <div className="flex justify-between items-center">
          <Link
            to={`/clubs/${club._id}`}
            className="text-green-600 font-medium hover:underline"
          >
            View Details
          </Link>
          {userRole === 'admin' && (
            <Link
              to={`/club-manage/${club._id}`}
              className="text-blue-600 font-medium hover:underline"
            >
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClubCard;

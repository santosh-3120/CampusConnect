import { Link } from 'react-router-dom';

function ClubCard({ club, userRole }) {
  const fallbackImage = 'https://placehold.co/300x160?text=No+Logo';

  return (
    <div className="bg-gray-800/90 rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={club.logo && club.logo.trim() !== '' ? club.logo : fallbackImage}
        alt={`${club.name} logo`}
        className="w-full h-40 object-cover rounded-t-lg"
        onError={(e) => {
          if (e.target.src !== fallbackImage) {
            e.target.src = fallbackImage;
          }
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{club.name}</h3>
        <p className="text-gray-400 mt-1 line-clamp-3">{club.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/clubs/${club._id}`}
            className="text-green-400 font-medium hover:underline text-sm"
          >
            View Details
          </Link>
          {userRole === 'admin' && (
            <Link
              to={`/club-manage/${club._id}`}
              className="text-yellow-400 hover:underline text-sm"
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

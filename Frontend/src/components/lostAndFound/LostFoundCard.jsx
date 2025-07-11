import { Link } from 'react-router-dom';

const LostFoundCard = ({ item }) => {
  const fallbackImage = 'https://placehold.co/300x160?text=No+Image';

  return (
    <div className="bg-gray-800/90 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
      <img
        src={item.image && item.image.trim() !== '' ? item.image : fallbackImage}
        alt={item.itemName}
        className="w-full h-40 object-cover rounded-t-lg"
        onError={(e) => {
          if (e.target.src !== fallbackImage) {
            e.target.src = fallbackImage;
          }
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{item.itemName}</h3>
        <p className="text-gray-300 mt-1">
          <strong>Status:</strong> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </p>
        <p className="text-gray-300 mt-1">
          <strong>Location:</strong> {item.location}
        </p>
        <p className="text-gray-300 mt-1">
          <strong>Posted by:</strong> {item.createdBy.name}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/lost-and-found/${item._id}`}
            className="text-green-400 font-medium hover:underline text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LostFoundCard;

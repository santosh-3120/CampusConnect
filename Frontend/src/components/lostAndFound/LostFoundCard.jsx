import { Link } from 'react-router-dom';
import Card from '../common/Card';
import placeholder from '../../assets/react.svg'; // Use vite.svg instead of placeholder.jpg

const LostFoundCard = ({ item }) => {
  return (
    <Card>
      <img
        src={item.image || placeholder}
        alt={item.itemName}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900">{item.itemName}</h3>
        <p className="text-gray-600 mt-1">Status: {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
        <p className="text-gray-600 mt-1">Location: {item.location}</p>
        <p className="text-gray-600 mt-1">Posted by: {item.createdBy.name}</p>
        <Link
          to={`/lost-and-found/${item._id}`}
          className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          View Details
        </Link>
      </div>
    </Card>
  );
};

export default LostFoundCard;
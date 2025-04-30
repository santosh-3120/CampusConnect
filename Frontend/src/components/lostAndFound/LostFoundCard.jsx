import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

function LostFoundCard({ post }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={post.image}
        alt={post.itemName}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800">{post.itemName}</h3>
        <p className="text-gray-600"><strong>Status:</strong> {post.status.toUpperCase()}</p>
        <p className="text-gray-600"><strong>Location:</strong> {post.location}</p>
        <p className="text-gray-600"><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
        {post.isClaimed && (
          <p className="text-green-600 font-semibold">
            Handed over to: {post.claimant.name} (Roll No: {post.claimant.rollNo})
          </p>
        )}
        <div className="flex space-x-4 mt-4">
          <Button
            onClick={() => navigate(`/lost-and-found/${post._id}`)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            View Details
          </Button>
          <Button
            onClick={() => navigate(`/lost-and-found/${post._id}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Inbox
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LostFoundCard;
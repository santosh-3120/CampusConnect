import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CommentSection from '../components/lostAndFound/CommentSection';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';
import { useLostFoundItem, claimItem, deleteItem } from '../features/lostAndFound/lostFoundHooks';
import placeholder from '../assets/react.svg'; 

const LostAndFoundDetails = () => {
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const { item, loading, error, refetch } = useLostFoundItem(id);
  const [toast, setToast] = useState(null);

  const handleClaim = async () => {
    try {
      await claimItem(id);
      setToast({ message: 'Item claimed successfully', type: 'success' });
      refetch();
    } catch (err) {
      setToast({ message: err.message || 'Failed to claim item', type: 'error' });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setToast({ message: 'Item deleted successfully', type: 'success' });
        navigate('/lost-and-found');
      } catch (err) {
        setToast({ message: err.message || 'Failed to delete item', type: 'error' });
      }
    }
  };

  if (loading) return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Loading...</div>;
  if (!item) return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Item not found</div>;

  const canEditDelete = user._id === item.createdBy._id || user.role === 'admin';

  return (
    <div className="min-h-screen bg-blue-50 font-sans flex flex-col">
      <Navbar user={user} logout={logout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">{item.itemName}</h2>
        {error && <Toast message={error} type="error" onClose={() => setToast(null)} />}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <img
            src={item.image || placeholder}
            alt={item.itemName}
            className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
          />
          <p className="text-gray-600 mb-2"><strong>Status:</strong> {item.status.charAt(0).toUpperCase() + item.status.slice(1)}</p>
          <p className="text-gray-600 mb-2"><strong>Description:</strong> {item.description || 'N/A'}</p>
          <p className="text-gray-600 mb-2"><strong>Location:</strong> {item.location}</p>
          <p className="text-gray-600 mb-2"><strong>Date:</strong> {new Date(item.date).toLocaleString()}</p>
          <p className="text-gray-600 mb-2"><strong>Posted by:</strong> {item.createdBy.name} ({item.createdBy.rollNo})</p>
          {item.handoverTo && <p className="text-gray-
600 mb-2"><strong>Handover To:</strong> {item.handoverTo}</p>}
          {item.handoverLocation && (
            <p className="text-gray-600 mb-2"><strong>Handover Location:</strong> {item.handoverLocation}</p>
          )}
          <div className="flex space-x-4 mt-4">
            {item.status !== 'claimed' && (
              <Button onClick={handleClaim} className="bg-green-600 hover:bg-green-700">
                Claim Item
              </Button>
            )}
            {canEditDelete && (
              <>
                <Link to={`/lost-and-found/${id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">Edit</Button>
                </Link>
                <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </Button>
              </>
            )}
          </div>
          <CommentSection itemId={id} comments={item.comments} refetch={refetch} setToast={setToast} />
        </div>
      </div>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LostAndFoundDetails;
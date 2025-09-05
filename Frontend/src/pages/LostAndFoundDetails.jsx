import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import CommentSection from '../components/lostAndFound/CommentSection';
import Button from '../components/common/Button';
import { Toast } from '../components/common/Toast';
import { useLostFoundItem, claimItem, deleteItem } from '../features/lostAndFound/lostFoundHooks';
import placeholder from '../assets/react.svg';

const LostAndFoundDetails = () => {
  const { user, logout } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { item, loading, error, refetch } = useLostFoundItem(id);
  const [toast, setToast] = useState(null);
  const [localItem, setLocalItem] = useState(null);

  // Update localItem with navigated state or fetched item
  useEffect(() => {
    if (location.state?.updatedItem) {
      setLocalItem(location.state.updatedItem);
    } else if (item) {
      setLocalItem(item);
    }
  }, [item, location.state]);

  const handleClaim = async () => {
    try {
      const response = await claimItem(id);
      setToast({ message: 'Item claimed successfully', type: 'success' });
      setLocalItem(response); // Update local state immediately
      await refetch(); // Refresh item data
    } catch (err) {
      setToast({
        message: err.response?.data?.message || err.message || 'Failed to claim item',
        type: 'error',
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteItem(id);
        setToast({ message: 'Item deleted successfully', type: 'success' });
        navigate('/lost-and-found');
      } catch (err) {
        setToast({
          message: err.response?.data?.message || err.message || 'Failed to delete item',
          type: 'error',
        });
      }
    }
  };

  if (loading || !localItem)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
        Loading...
      </div>
    );

  const canEditDelete = user._id === localItem.createdBy._id || user.role === 'admin';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <Navbar user={user} logout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        <h2 className="text-3xl font-extrabold text-yellow-300 mb-6">{localItem.itemName}</h2>

        {error && <Toast message={error} type="error" onClose={() => setToast(null)} />}

        <div className="bg-gray-900 bg-opacity-90 rounded-lg shadow-lg p-6">
          <img
            src={localItem.image || placeholder}
            alt={localItem.itemName}
            className="w-full max-w-md h-64 object-cover rounded-lg mb-4"
          />
          <p className="mb-2">
            <strong>Status:</strong> {localItem.status.charAt(0).toUpperCase() + localItem.status.slice(1)}
          </p>
          <p className="mb-2">
            <strong>Description:</strong> {localItem.description || 'N/A'}
          </p>
          <p className="mb-2">
            <strong>Location:</strong> {localItem.location}
          </p>
          <p className="mb-2">
            <strong>Date:</strong> {new Date(localItem.date).toLocaleString()}
          </p>
          <p className="mb-2">
            <strong>Posted by:</strong> {localItem.createdBy.name} ({localItem.createdBy.rollNo})
          </p>
          {localItem.handoverTo && (
            <p className="mb-2">
              <strong>Handover To:</strong> {localItem.handoverTo}
            </p>
          )}
          {localItem.handoverLocation && (
            <p className="mb-2">
              <strong>Handover Location:</strong> {localItem.handoverLocation}
            </p>
          )}
          {localItem.isClaimed ? (
            <p className="mb-2">
              <strong>Claimed by:</strong> {localItem.claimant.name} ({localItem.claimant.rollNo})
            </p>
          ) : (
            <Button onClick={handleClaim} className="bg-green-600 hover:bg-green-700">
              Claim Item
            </Button>
          )}

          <div className="flex flex-wrap gap-4 mt-4">
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

          <CommentSection
            itemId={id}
            comments={localItem.comments}
            refetch={refetch}
            setToast={setToast}
          />
        </div>
      </div>

      <Footer />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default LostAndFoundDetails;
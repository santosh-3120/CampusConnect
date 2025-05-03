import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClub, useCreateClub, useUpdateClub, useDeleteClub } from '../features/clubs/clubsHooks';
import ClubForm from '../components/clubs/ClubForm';
import ClubNavbar from '../components/layout/ClubNavbar';
import {Spinner} from '../components/common/Spinner';
import {Toast} from '../components/common/Toast';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { AuthContext } from '../context/AuthContext';

function ClubManage() {
  const { id } = useParams();
  const { user, loading } = useContext(AuthContext);
  const { club, isLoading, error, fetchClub } = useClub(id);
  const { createClub, isCreating } = useCreateClub();
  const { updateClub, isUpdating } = useUpdateClub(id);
  const { deleteClub, isDeleting } = useDeleteClub(id);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (id) fetchClub();
  }, [id, loading, fetchClub]);

  if (loading || isLoading) return <Spinner />;
  if (!user || user.role !== 'admin') return null; // Handled by ProtectedRoute requiredRole="admin"

  const handleSubmit = async (formData) => {
    try {
      if (id) {
        await updateClub(formData);
      } else {
        await createClub(formData);
      }
      navigate('/clubs');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteClub();
      navigate('/clubs');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <ClubNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {id ? 'Edit Club' : 'Create Club'}
          </h1>
          <Link to="/clubs" className="text-green-600 hover:underline">
            Back to Clubs
          </Link>
        </div>
        {error && <Toast message={error} type="error" />}
        <ClubForm
          club={club}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
        {id && (
          <div className="mt-6">
            <Button
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              Delete Club
            </Button>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title="Confirm Delete"
              onConfirm={handleDelete}
              confirmText="Delete"
              cancelText="Cancel"
            >
              <p>Are you sure you want to delete this club? This action cannot be undone.</p>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubManage;
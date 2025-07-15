import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useClub, useCreateClub, useUpdateClub, useDeleteClub } from '../features/clubs/clubsHooks';
import ClubForm from '../components/clubs/ClubForm';
import ClubNavbar from '../components/layout/ClubNavbar';
import { Spinner } from '../components/common/Spinner';
import { Toast } from '../components/common/Toast';
import Button1 from '../components/common/Button1';
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
  if (!user || user.role !== 'admin') return null;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      <ClubNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <Toast message={error} type="error" />}
        <ClubForm
          club={club}
          onSubmit={handleSubmit}
          isSubmitting={isCreating || isUpdating}
        />
        {id && (
          <div className="mt-6">
            <Button1
              variant="danger"
              onClick={() => setDeleteModalOpen(true)}
              disabled={isDeleting}
            >
              Delete Club
            </Button1>
            <Modal
              isOpen={isDeleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              title="Confirm Delete"
            >
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete this club? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </Modal>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClubManage;

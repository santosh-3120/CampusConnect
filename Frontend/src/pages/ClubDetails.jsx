import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  useClub,
  useClubMessages,
  useFollowClub,
  useUnfollowClub,
  useDeleteMessage,
  useFollowers,
  useRemoveFollower
} from '../features/clubs/clubsHooks';
import ClubNavbar from '../components/layout/ClubNavbar';
import {Spinner} from '../components/common/Spinner';
import {Toast} from '../components/common/Toast';
import FollowButton from '../components/clubs/FollowButton';
import SocialLinks from '../components/clubs/SocialLinks';
import Messages from '../components/clubs/Messages';
import Button from '../components/common/Button';
import { AuthContext } from '../context/AuthContext';
import FollowersModal from '../components/clubs/FollowersModal'; // Importing the modal

function ClubDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { club, isLoading, error, fetchClub } = useClub(id);
  const {
    messages,
    isMessagesLoading,
    messagesError,
    postMessage,
    fetchMessages
  } = useClubMessages(id);

  const { followers, isFollowersLoading, followersError, fetchFollowers } = useFollowers(id);
  const { removeFollower, isRemoving } = useRemoveFollower(id);

  const [newMessage, setNewMessage] = useState('');
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const { followClub, isFollowing } = useFollowClub(id, fetchMessages);
  const { unfollowClub, isUnfollowing } = useUnfollowClub(id, fetchMessages);
  const { deleteMessage } = useDeleteMessage();

  useEffect(() => {
    const fetchData = async () => {
      await fetchClub();
      await fetchMessages();
      await fetchFollowers();
    };
    fetchData();
  }, [fetchClub, fetchMessages, fetchFollowers]);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await postMessage({ content: newMessage }, user);
      setNewMessage('');
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!id || !messageId) {
      console.error('Club ID or Message ID is missing!');
      return;
    }

    try {
      await deleteMessage(id, messageId);
      await fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  const isStudentFollowing = user?.role === 'student' && club?.followers?.includes(user._id);
  const isAdmin = user?.role === 'admin';
  const canDelete = isAdmin;

  const handleRemoveFollower = async (followerId) => {
    try {
      await removeFollower(followerId);
      await fetchFollowers(); // Re-fetch followers after removal
    } catch (err) {
      console.error('Error removing follower:', err);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <ClubNavbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <Toast message={error} type="error" />}
        {club && (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                {club.logo && (
                  <img src={club.logo} alt={`${club.name} logo`} className="w-16 h-16 rounded-full" />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
                  <p
                    className="text-gray-600 cursor-pointer z-10 relative"
                    onClick={() => club?.followers?.length > 0 && setShowFollowersModal(true)}
                  >
                    {club.followers?.length || 0} followers
                  </p>
                </div>
              </div>

              {user?.role === 'student' && (
                <FollowButton
                  isFollowing={isStudentFollowing}
                  onFollow={async () => {
                    await followClub();
                    await fetchClub();
                    await fetchMessages();
                    await fetchFollowers(); // ✅ Ensure this is awaited
                  }}
                  onUnfollow={async () => {
                    await unfollowClub();
                    await fetchClub();
                    await fetchFollowers(); // ✅ Ensure this is awaited
                  }}
                  isLoading={isFollowing || isUnfollowing}
                />
              )}
            </div>

            <p className="text-gray-700 mb-6">{club.description}</p>
            <SocialLinks socialLinks={club.socialLinks} />

            {isAdmin && (
              <Link to={`/club-manage/${club._id}`} className="inline-block mt-6 mb-6">
                <Button variant="primary">Edit Club</Button>
              </Link>
            )}

            {(isAdmin || isStudentFollowing) && (
              <Messages
                clubId={id}
                messages={messages}
                isLoading={isMessagesLoading}
                error={messagesError}
                onSubmit={handleMessageSubmit}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                canPost={isAdmin}
                canDelete={canDelete}
                onDelete={handleDeleteMessage}
              />
            )}

            {user?.role === 'student' && !isStudentFollowing && (
              <p className="text-red-600 mt-4">Follow this club to view its messages.</p>
            )}
          </>
        )}
      </div>

      {/* Modal for displaying followers */}
      {showFollowersModal && (
        <FollowersModal
          followers={followers}
          onClose={() => setShowFollowersModal(false)}
          onRemove={handleRemoveFollower}
          isAdmin={isAdmin}
        />
      )}
    </div>
  );
}

export default ClubDetails;

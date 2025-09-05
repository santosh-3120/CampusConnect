import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import {
  useClub,
  useClubMessages,
  useFollowClub,
  useUnfollowClub,
  useDeleteMessage,
  useFollowers,
  useRemoveFollower,
} from "../features/clubs/clubsHooks";
import { Spinner } from "../components/common/Spinner";
import { Toast } from "../components/common/Toast";
import FollowButton from "../components/clubs/FollowButton";
import SocialLinks from "../components/clubs/SocialLinks";
import Messages from "../components/clubs/Messages";
import Button from "../components/common/Button";
import { AuthContext } from "../context/AuthContext";
import FollowersModal from "../components/clubs/FollowersModal";
import { Navbar } from "../components/ui/Navbar";

// 👇 Icons
import { Eye, MessageCircle } from "lucide-react";

function ClubDetails() {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);

  const { club, isLoading, error, fetchClub } = useClub(id);
  const {
    messages,
    isMessagesLoading,
    messagesError,
    postMessage,
    fetchMessages,
  } = useClubMessages(id);

  const { followers, fetchFollowers } = useFollowers(id);
  const { removeFollower } = useRemoveFollower(id);

  const [newMessage, setNewMessage] = useState("");
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      setNewMessage("");
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!id || !messageId) return;
    try {
      await deleteMessage(id, messageId);
      await fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    try {
      await removeFollower(followerId);
      await fetchFollowers();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const isAdmin = user?.role === "admin";
  const isStudentFollowing =
    user?.role === "student" && club?.followers?.includes(user.id);

  if (isLoading) return <Spinner />;

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white'>
      {/* <nav className='bg-gray-900 bg-opacity-90 shadow-lg p-4'>
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
          <h1 className='text-2xl font-bold'>CampusConnect Clubs</h1>
          <div className='space-x-4'>
            <button onClick={toggleModal} className='hover:text-yellow-300'>
              {user.name}
            </button>
            <button onClick={logout} className='hover:text-yellow-300'>
              Logout
            </button>
          </div>
        </div>
      </nav> */}

      <Navbar
        name='Clubs'
        username={user && user.name}
        toggleModal={toggleModal}
        logout={logout}
      />

      {/* Profile Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-lg font-semibold'>{user.name}</h3>
            <p className='text-sm'>{user.role}</p>
            <p className='text-sm mt-2'>{user.email}</p>
            <button
              onClick={toggleModal}
              className='mt-4 w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg'
            >
              Close
            </button>
          </div>
        </div>
      )}

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow'>
        {error && <Toast message={error} type='error' />}
        {club && (
          <>
            <div className='flex justify-between items-center mb-8 w-3xl border-b-2 space-y-4 border-b-yellow-300'>
              <div className='flex items-center space-x-4'>
                {club.logo && (
                  <img
                    src={club.logo}
                    alt={`${club.name} logo`}
                    className='w-16 h-16 rounded-full'
                  />
                )}
                <div>
                  <h2 className='text-4xl font-extrabold text-yellow-300'>
                    {club.name}
                  </h2>
                  <div className='flex items-center space-x-2'>
                    {/* Followers count stays clickable */}
                    <p
                      className='text-gray-200 cursor-pointer'
                      onClick={() =>
                        club?.followers?.length > 0 &&
                        setShowFollowersModal(true)
                      }
                    >
                      {club.followers?.length || 0} followers
                    </p>
                    {/* 👁️ Eye icon */}
                    {club?.followers?.length > 0 && (
                      <button
                        onClick={() => setShowFollowersModal(true)}
                        className='p-1 rounded hover:bg-gray-700'
                        title='View Followers'
                      >
                        <Eye className='w-4 h-4 text-yellow-300' />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex items-center space-x-4'>
                {user?.role === "student" && (
                  <FollowButton
                    isFollowing={isStudentFollowing}
                    onFollow={async () => {
                      await followClub();
                      await fetchClub();
                      await fetchMessages();
                      await fetchFollowers();
                    }}
                    onUnfollow={async () => {
                      await unfollowClub();
                      await fetchClub();
                      await fetchFollowers();
                    }}
                    isLoading={isFollowing || isUnfollowing}
                  />
                )}
                {/* message icon */}
                {(isAdmin || isStudentFollowing) && (
                  <button
                    onClick={() => setShowMessagesModal(true)}
                    className='p-2 bg-gray-700 hover:bg-gray-600 rounded-full'
                    title='View Messages'
                  >
                    <MessageCircle className='w-5 h-5 text-yellow-300' />
                  </button>
                )}
              </div>
            </div>

            <div className='bg-gray-800/90 rounded-lg shadow-md p-6 mb-6'>
              <p className='text-gray-200 mb-6'>{club.description}</p>
              <SocialLinks socialLinks={club.socialLinks} />

              {isAdmin && (
                <Link
                  to={`/club-manage/${club._id}`}
                  className='inline-block mt-6'
                >
                  <Button className='bg-blue-600 hover:bg-blue-700'>
                    Edit Club
                  </Button>
                </Link>
              )}
            </div>

            {user?.role === "student" && !isStudentFollowing && (
              <p className='text-red-200 mt-4'>
                Follow this club to view its messages.
              </p>
            )}
          </>
        )}
      </main>

      <footer className='bg-gray-900 p-4 mt-auto'>
        <div className='max-w-7xl mx-auto text-center'>
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowersModal
          followers={followers}
          onClose={async () => {
            setShowFollowersModal(false);
            await fetchFollowers();
          }}
          onRemove={handleRemoveFollower}
          isAdmin={isAdmin}
        />
      )}

      {/* Messages Modal */}
      {showMessagesModal && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50'>
          <div className='bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl h-[80vh] flex flex-col'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-xl font-bold text-yellow-300'>Messages</h3>
              <button
                onClick={() => setShowMessagesModal(false)}
                className='text-gray-400 hover:text-white'
              >
                ✕
              </button>
            </div>

            {/* Messages area */}
            <div className='flex-1 overflow-y-auto pr-2'>
              <Messages
                clubId={id}
                messages={messages}
                isLoading={isMessagesLoading}
                error={messagesError}
                onSubmit={handleMessageSubmit}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                canPost={isAdmin}
                canDelete={isAdmin}
                onDelete={handleDeleteMessage}
              />
            </div>

            {/* Divider */}
            <div className='border-t border-gray-700 my-2'></div>

            {/* Input pinned at bottom */}
            {isAdmin && (
              <form
                onSubmit={handleMessageSubmit}
                className='flex items-center space-x-2 mt-2'
              >
                <input
                  type='text'
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder='Type your message...'
                  className='flex-1 p-2 rounded bg-gray-700 text-white focus:outline-none'
                />
                <button
                  type='submit'
                  className='px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg'
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ClubDetails;

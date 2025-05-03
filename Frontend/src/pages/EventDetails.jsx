import React, { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEvent } from '../features/events/eventsHooks';
import { AuthContext } from '../context/AuthContext';
import RSVPButton from '../components/events/RSVPButton';
import {Spinner} from '../components/common/Spinner';
import {Toast} from '../components/common/Toast';
import { formatDate } from '../utils/formatDate';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const { event, loading, error, refetch } = useEvent(id);
  const { user } = useContext(AuthContext);
  const isRSVPed = event?.rsvps.includes(user?._id);

  // State for comments
  const [commentText, setCommentText] = useState('');
  const [commentImage, setCommentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // Toast state
  const [showErrorToast, setShowErrorToast] = useState(false);

  // Fallback images for different sizes
  const profileFallbackImage = 'https://placehold.co/64x64?text=No+Image';
  const commentFallbackImage = 'https://placehold.co/48x48?text=No+Image';

  // Check if user has liked the event
  useEffect(() => {
    if (event && user) {
      setLiked(event.likes.includes(user._id));
      setLikeCount(event.likes.length);
    }
  }, [event, user]);

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      setShowErrorToast(true);
      setTimeout(() => setShowErrorToast(false), 3000);
    }
  }, [error]);

  // Handle image selection for comment
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCommentImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to comment.');
      return;
    }
    if (!commentText && !commentImage) {
      alert('Please add a comment or image.');
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('text', commentText);
    if (commentImage) {
      formData.append('image', commentImage);
    }
    formData.append('userId', user._id);

    try {
      await axios.post(`http://localhost:3000/api/events/${id}/comments`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setCommentText('');
      setCommentImage(null);
      setImagePreview(null);
      refetch();
    } catch (err) {
      console.error('Error submitting comment:', err);
      alert('Failed to submit comment.');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle like
  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like this event.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/events/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
      alert('Failed to toggle like.');
    }
  };

  if (loading) return <Spinner />;
  if (showErrorToast && error) return <Toast message={error} type="error" onClose={() => setShowErrorToast(false)} />;
  if (!event) return <p className="text-gray-400 text-center">Event not found.</p>;

  return (
    <div className="container mx-auto p-4 bg-gray-900 text-gray-100 min-h-screen">
      {/* Event Header */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={event.image || profileFallbackImage}
          alt={event.title}
          className="w-16 h-16 object-cover rounded-full"
          onError={(e) => {
            if (e.target.src !== profileFallbackImage) {
              e.target.src = profileFallbackImage;
            }
          }}
        />
        <h1 className="text-3xl font-bold text-gray-100">{event.title}</h1>
      </div>

      {/* Like Button and Count */}
      <div className="flex items-center gap-2 mb-4">
        <button onClick={handleLike} className="focus:outline-none">
          {liked ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-400 text-xl" />
          )}
        </button>
        <span className="text-gray-400">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
      </div>

      {/* Event Details */}
      <p className="text-gray-300 mb-4">{event.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 shadow-md">
          <p className="text-gray-300">
            <strong>Date:</strong> {formatDate(event.date)}
          </p>
        </div>
        <div className="bg-gray-800/30 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 shadow-md">
          <p className="text-gray-300">
            <strong>Location:</strong> {event.location}
          </p>
        </div>
        <p className="text-gray-300">
          <strong>Organizer:</strong> {event.organizer?.name || 'Unknown'}
        </p>
        <p className="text-gray-300">
          <strong>RSVPs:</strong> {event.rsvps.length}
        </p>
      </div>
      {!isRSVPed && <RSVPButton eventId={event._id} />}

      {/* Comment Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold text-gray-100 mb-2">Comments</h2>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none bg-gray-800 text-gray-100 placeholder-gray-400"
              rows="2"
            />
            <div className="flex flex-row gap-2">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-base hover:bg-gray-600 text-gray-100 min-w-[100px] text-center shadow-sm"
                >
                  Add Image
                </button>
              </label>
              <button
                type="submit"
                disabled={submitting}
                className={`px-4 py-2 rounded-lg text-white min-w-[100px] text-center border border-gray-600 shadow-sm ${
                  submitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {submitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            </div>
          )}
        </form>

        {/* Display Comments */}
        {event.comments && event.comments.length > 0 ? (
          <div className="space-y-4">
            {event.comments.map((comment, index) => (
              <div
                key={index}
                className="bg-gray-800/50 border border-gray-600/50 rounded-lg p-4 shadow-sm backdrop-blur-md"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={comment.userId?.profileImage || profileFallbackImage}
                    alt={comment.userId?.name || 'User'}
                    className="w-8 h-8 object-cover rounded-full"
                    onError={(e) => {
                      if (e.target.src !== profileFallbackImage) {
                        e.target.src = profileFallbackImage;
                      }
                    }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-100">
                      {comment.userId?.name || 'Anonymous'}
                    </p>
                    <p className="text-gray-300">{comment.text}</p>
                    {comment.image && (
                      <img
                        src={comment.image || commentFallbackImage}
                        alt="Comment"
                        className="w-12 h-12 object-cover rounded-lg mt-1"
                        onError={(e) => {
                          if (e.target.src !== commentFallbackImage) {
                            e.target.src = commentFallbackImage;
                          }
                        }}
                      />
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;

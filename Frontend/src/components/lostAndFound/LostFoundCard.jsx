import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import { FaComment, FaHeart, FaRegHeart } from 'react-icons/fa';
import Modal from '../common/Modal';

const LostFoundCard = ({ item, onDelete }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liked, setLiked] = useState(item.likes?.includes(user?._id) || false);
  const [likeCount, setLikeCount] = useState(item.likes?.length || 0);
  const [commentText, setCommentText] = useState('');

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/lost-found/${item._id}/like`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) return;
    try {
      await fetch(`http://localhost:3000/api/lost-found/${item._id}/comments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: commentText, userId: user._id }),
      });
      setCommentText('');
    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  const handleProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="card">
      <div className="flex items-center p-4">
        <img
          src={item.user?.profileImage || 'https://placehold.co/40x40?text=User'}
          alt="User"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={handleProfileClick}
        />
        <span className="ml-2 font-semibold text-gray-800 cursor-pointer" onClick={handleProfileClick}>
          {item.user?.name || 'Unknown'}
        </span>
      </div>
      <img
        src={item.image || 'https://placehold.co/600x400?text=Item'}
        alt={item.title}
        className="post-image"
      />
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={handleLike}>
              {liked ? <FaHeart className="text-red-500 text-xl" /> : <FaRegHeart className="text-gray-500 text-xl" />}
            </button>
            <FaComment className="text-gray-500 text-xl" />
          </div>
          <button
            onClick={() => navigate(`/chats/${item.user?._id}`)}
            className="btn-primary"
          >
            Contact
          </button>
        </div>
        <p className="text-gray-600 mt-2">{likeCount} likes</p>
        <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
        <p className="text-gray-600 mt-1">{item.description}</p>
        <p className="text-sm text-gray-500 mt-2">Type: {item.type}</p>
        <p className="text-sm text-gray-500">Location: {item.location}</p>
        <p className="text-sm text-gray-500">Posted: {formatDate(item.createdAt)}</p>
        <form onSubmit={handleCommentSubmit} className="mt-4 flex">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="input-field flex-1"
          />
          <button type="submit" className="btn-primary ml-2">Post</button>
        </form>
        {item.comments?.map((comment, index) => (
          <div key={index} className="mt-2">
            <span className="font-semibold">{comment.userId?.name || 'Anonymous'}: </span>
            <span>{comment.text}</span>
          </div>
        ))}
        {isAdmin && (
          <div className="mt-4">
            <button onClick={() => onDelete(item._id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Profile">
        <p><strong>Name:</strong> {item.user?.name}</p>
        <p><strong>Roll No:</strong> {item.user?.rollNo}</p>
        <p><strong>Email:</strong> {item.user?.email}</p>
        <button
          onClick={() => navigate(`/chats/${item.user?._id}`)}
          className="btn-primary mt-4"
        >
          Start Chat
        </button>
      </Modal>
    </div>
  );
};

export default LostFoundCard;
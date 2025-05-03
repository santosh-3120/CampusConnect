import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';
import { FaComment, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import Modal from '../common/Modal';

const QuestionCard = ({ question, onDelete }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvoted, setUpvoted] = useState(question.upvotes.includes(user?._id));
  const [upvoteCount, setUpvoteCount] = useState(question.upvotes.length);
  const [commentText, setCommentText] = useState('');

  const handleUpvote = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/forum/${question._id}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setUpvoted(data.upvoted);
      setUpvoteCount(data.upvoteCount);
    } catch (err) {
      console.error('Error toggling upvote:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText) return;
    try {
      await fetch(`http://localhost:3000/api/forum/${question._id}/comments`, {
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
          src={question.user?.profileImage || 'https://placehold.co/40x40?text=User'}
          alt="User"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={handleProfileClick}
        />
        <span className="ml-2 font-semibold text-gray-800 cursor-pointer" onClick={handleProfileClick}>
          {question.user?.name || 'Unknown'}
        </span>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-4">
            <button onClick={handleUpvote}>
              {upvoted ? <FaArrowUp className="text-green-500 text-xl" /> : <FaArrowUp className="text-gray-500 text-xl" />}
            </button>
            <span>{upvoteCount}</span>
            <FaComment className="text-gray-500 text-xl" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mt-2">{question.title}</h3>
        <p className="text-gray-600 mt-1">{question.content}</p>
        <p className="text-sm text-gray-500 mt-2">Posted: {formatDate(question.createdAt)}</p>
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
        {question.comments?.map((comment, index) => (
          <div key={index} className="mt-2">
            <span className="font-semibold">{comment.userId?.name || 'Anonymous'}: </span>
            <span>{comment.text}</span>
          </div>
        ))}
        {isAdmin && (
          <div className="mt-4">
            <button onClick={() => onDelete(question._id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Profile">
        <p><strong>Name:</strong> {question.user?.name}</p>
        <p><strong>Roll No:</strong> {question.user?.rollNo}</p>
        <p><strong>Email:</strong> {question.user?.email}</p>
        <button
          onClick={() => navigate(`/chats/${question.user?._id}`)}
          className="btn-primary mt-4"
        >
          Start Chat
        </button>
      </Modal>
    </div>
  );
};

export default QuestionCard;
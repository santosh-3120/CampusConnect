import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Textarea from '../common/Textarea';
import Button from '../common/Button';
import { addComment } from '../../features/lostAndFound/lostFoundHooks';
import { formatDate } from '../../utils/formatDate';

const CommentSection = ({ itemId, comments, refetch, setToast }) => {
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await addComment(itemId, comment);
      setToast({ message: 'Comment added successfully', type: 'success' });
      setComment('');
      refetch();
    } catch (err) {
      setToast({ message: err.message || 'Failed to add comment', type: 'error' });
    }
  };

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Comments</h3>
      <form onSubmit={handleSubmit} className="mb-4">
        <Textarea
          label="Add a comment"
          id="comment"
          name="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          rows={3}
        />
        <Button type="submit" className="mt-2 bg-green-600 hover:bg-green-700">
          Post Comment
        </Button>
      </form>
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet.</p>
      ) : (
        comments.map((c, index) => (
          <div key={index} className="mb-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-gray-800">{c.text}</p>
            <p className="text-sm text-gray-600">
              By {c.userId.name} on {formatDate(c.createdAt)}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentSection;
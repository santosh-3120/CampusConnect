import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext.jsx';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Mock fetch comments
    // Axios.get(`/api/lost-found/${postId}/comments`).then(res => setComments(res.data));
    setComments([
      { _id: '1', text: 'I saw this wallet near the library!', createdBy: { name: 'John Doe' }, createdAt: '2025-04-28T10:00:00Z' },
    ]);
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        _id: Date.now().toString(),
        text: newComment,
        createdBy: { name: user.name },
        createdAt: new Date().toISOString(),
      };
      // Mock post comment
      // Axios.post(`/api/lost-found/${postId}/comment`, { text: newComment });
      setComments((prev) => [...prev, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Comments</h2>
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <div key={comment._id} className="mb-4 border-b pb-2">
            <p className="text-gray-600">
              <strong>{comment.createdBy.name}</strong>: {comment.text}
            </p>
            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))
      )}
      <div className="mt-4 flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleAddComment}
          className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Post
        </Button>
      </div>
    </div>
  );
}

export default CommentSection;
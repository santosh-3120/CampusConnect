import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CommentSection from '../components/lostAndFound/CommentSection';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { SocketContext } from '../context/SocketContext.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

function LostAndFoundDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  useEffect(() => {
    // Mock fetch post
    // Axios.get(`/api/lost-found/${id}`).then(res => setPost(res.data));
    setPost({
      _id: id,
      itemName: 'Wallet',
      description: 'Black leather wallet with ID cards',
      image: '/assets/placeholder.jpg',
      location: 'Library',
      status: 'lost',
      date: '2025-04-28',
      handoverTo: 'Prof. Smith',
      handoverLocation: 'Office Room 101',
      isClaimed: false,
      createdBy: { _id: 'user1', name: 'Jane Doe', rollNo: 'B456' },
    });

    // Mock fetch chat history
    // Axios.get(`/api/chats/${id}`).then(res => setMessages(res.data.messages));
    setMessages([
      { _id: '1', sender: { _id: 'user1', name: 'Jane Doe' }, text: 'Is this your wallet?', createdAt: '2025-04-28T10:00:00Z' },
    ]);

    // Listen for new messages
    socket.on('newMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.off('newMessage');
  }, [id, socket]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        chatId: id,
        sender: { _id: user._id, name: user.name },
        text: newMessage,
        createdAt: new Date().toISOString(),
      };
      // Mock send message
      // socket.emit('sendMessage', message);
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleClaim = () => {
    // Mock claim item
    // Axios.post(`/api/lost-found/${id}/claim`).then(() => {
    setPost((prev) => ({
      ...prev,
      isClaimed: true,
      claimant: { name: user.name, rollNo: user.rollNo },
    }));
    setIsClaimModalOpen(false);
    // });
  };

  if (!post) return <div className="container mx-auto p-6 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{post.itemName}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={post.image}
          alt={post.itemName}
          className="w-full h-64 object-cover rounded-lg"
        />
        <div className="space-y-4">
          <p className="text-gray-600"><strong>Status:</strong> {post.status.toUpperCase()}</p>
          <p className="text-gray-600"><strong>Description:</strong> {post.description}</p>
          <p className="text-gray-600"><strong>Location:</strong> {post.location}</p>
          <p className="text-gray-600"><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
          <p className="text-gray-600"><strong>Handover To:</strong> {post.handoverTo}</p>
          <p className="text-gray-600"><strong>Handover Location:</strong> {post.handoverLocation}</p>
          {post.isClaimed && (
            <p className="text-green-600 font-semibold">
              Handed over to: {post.claimant.name} (Roll No: {post.claimant.rollNo})
            </p>
          )}
          <div className="flex space-x-4">
            {!post.isClaimed && (
              <Button
                onClick={() => setIsClaimModalOpen(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Claim Item
              </Button>
            )}
            <Button
              onClick={() => setIsChatOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Inbox
            </Button>
          </div>
        </div>
      </div>
      <CommentSection postId={id} />
      <Modal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        title={`Chat with ${post.createdBy.name}`}
      >
        <div className="h-64 overflow-y-auto p-4 bg-gray-100 rounded-lg">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 ${msg.sender._id === user._id ? 'text-right' : 'text-left'}`}
            >
              <p className="inline-block p-2 rounded-lg bg-gray-200">
                <strong>{msg.sender.name}:</strong> {msg.text}
              </p>
              <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSendMessage}
            className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Send
          </Button>
        </div>
      </Modal>
      <Modal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        title="Confirm Claim"
      >
        <p className="mb-4">Are you sure you want to claim this item?</p>
        <div className="flex justify-end space-x-4">
          <Button
            onClick={() => setIsClaimModalOpen(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Confirm
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default LostAndFoundDetails;
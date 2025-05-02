import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { connectSocket, onNewChat, onNewMessage } from '../services/socket';

const Inbox = () => {
  const { user, logout } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [recipientId, setRecipientId] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      connectSocket(user._id);
      fetchChats();
      fetchUsers();
      onNewChat((newChat) => {
        setChats((prev) => [newChat, ...prev.filter(chat => chat._id !== newChat._id)]);
      });
      onNewMessage(({ chatId, message }) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === chatId
              ? { ...chat, messages: [...chat.messages, message], lastMessage: message.createdAt }
              : chat
          )
        );
      });
    }
  }, [user]);

  const fetchChats = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/chats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setChats(response.data);
    } catch (err) {
      setError('Failed to load chats');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/auth/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(response.data.filter(u => u._id !== user._id));
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const handleStartChat = async () => {
    if (!recipientId) return;
    try {
      const response = await axios.post(`http://localhost:3000/api/chats/${recipientId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setChats((prev) => [response.data, ...prev.filter(chat => chat._id !== response.data._id)]);
      navigate(`/chat/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start chat');
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 font-sans">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600">CollegeHub</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name} ({user.role})</span>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Inbox</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Start a New Chat</h3>
          <select
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            className="p-3 border rounded-lg w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            <option value="">Select a user</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>{u.name} ({u.rollNo})</option>
            ))}
          </select>
          <button
            onClick={handleStartChat}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Start Chat
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-lg">
          {chats.length === 0 ? (
            <p className="p-6 text-gray-600">No chats yet. Start a new conversation!</p>
          ) : (
            chats.map((chat) => {
              const otherUser = chat.participants.find(p => p._id !== user._id);
              const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
              return (
                <Link
                  key={chat._id}
                  to={`/chat/${chat._id}`}
                  className="block p-4 border-b hover:bg-gray-50"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">{otherUser.name}</h4>
                      <p className="text-gray-600">
                        {lastMessage ? lastMessage.text.substring(0, 50) : 'No messages yet'}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {lastMessage ? new Date(lastMessage.createdAt).toLocaleTimeString() : ''}
                    </p>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Inbox;
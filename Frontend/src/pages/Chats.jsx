// src/pages/Chats.jsx
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import ChatSearch from '../components/chats/ChatSearch';
import ChatListItem from '../components/chats/ChatListItem';
import SocketService from '../services/SocketService';
import axios from 'axios';

const Chats = () => {
  const { user, loading } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.token) {
        console.warn('No user or token found, redirecting to login');
        navigate('/login');
        return;
      }

      // Fetch user's chats
      axios.get('/api/chats', {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => {
        setChats(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats');
        if (err.response?.status === 401) {
          navigate('/login');
        }
      });

      // Initialize Socket.IO and listen for events
      SocketService.connect(user.token);
      SocketService.on('newChat', (chat) => {
        setChats((prev) => [chat, ...prev.filter((c) => c._id !== chat._id)]);
      });
      SocketService.on('newMessage', (data) => {
        setChats((prev) =>
          prev.map((chat) =>
            chat._id === data.chatId
              ? {
                  ...chat,
                  messages: [...(chat.messages || []), data.message],
                  lastMessage: {
                    text: data.message.text,
                    createdAt: data.message.createdAt,
                  },
                }
              : chat
          ).sort(
            (a, b) =>
              new Date(b.lastMessage?.createdAt || 0) -
              new Date(a.lastMessage?.createdAt || 0)
          )
        );
      });

      // Cleanup on unmount
      return () => SocketService.disconnect();
    }
  }, [user, loading, navigate]);

  const handleStartChat = async (recipientId) => {
    try {
      const res = await axios.post(`/api/chats/${recipientId}`, {}, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setChats((prev) => [res.data, ...prev.filter((c) => c._id !== res.data._id)]);
      setError(null);
    } catch (err) {
      console.error('Error starting chat:', err);
      setError('Failed to start chat');
      if (err.response?.status === 401) navigate('/login');
    }
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading chats...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">CampusConnect Chats</h1>
          <Link to="/dashboard" className="hover:text-yellow-300">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8">
        <ChatSearch onStartChat={handleStartChat} />
        <h2 className="text-3xl font-extrabold mb-6 text-yellow-300">Your Chats</h2>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        <div className="space-y-4">
          {chats.length === 0 ? (
            <p className="text-gray-300">No chats yet. Start one above!</p>
          ) : (
            chats.map((chat) => (
              <ChatListItem key={chat._id} chat={chat} currentUserId={user._id} />
            ))
          )}
        </div>
      </main>

      <footer className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Chats;

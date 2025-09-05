// src/pages/ChatPage.jsx
import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Message from '../components/chats/Message';
import axios from 'axios';
import SocketService from '../services/SocketService';

const ChatPage = () => {
  const { user } = useContext(AuthContext);
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipient, setRecipient] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.token) {
      navigate('/login');
      return;
    }

    // Fetch chat messages
    axios.get(`/api/chats/messages/${chatId}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => {
      setMessages(res.data.messages);
      const otherParticipant = res.data.participants.find((p) => p._id !== user._id);
      setRecipient(otherParticipant);
    }).catch((err) => {
      console.error('Error fetching messages:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    });

    // Initialize Socket.IO and listen for new messages
    SocketService.connect(user.token);
    SocketService.on('newMessage', (data) => {
      if (data.chatId === chatId) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    return () => SocketService.disconnect();
  }, [chatId, user, navigate]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !user.token) {
      if (!user || !user.token) navigate('/login');
      return;
    }

    try {
      const res = await axios.post(
        `/api/chats/message/${chatId}`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setMessages((prev) => [...prev, res.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <nav className="bg-gray-900 bg-opacity-90 shadow-lg p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/chats" className="mr-4 hover:text-yellow-300">
              <FaArrowLeft />
            </Link>
            <h1 className="text-2xl font-bold">
              {recipient ? `${recipient.name} (${recipient.rollNo})` : 'Loading...'}
            </h1>
          </div>
          <Link to="/dashboard" className="hover:text-yellow-300">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 flex flex-col">
        <div className="flex-grow overflow-y-auto bg-gray-800 rounded-lg p-4 mb-4">
          {messages.length === 0 ? (
            <p className="text-gray-300 text-center">No messages yet.</p>
          ) : (
            messages.map((msg, index) => (
              <Message key={index} message={msg} currentUserId={user?._id} />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </main>

      <footer className="bg-gray-900 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 CampusConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;

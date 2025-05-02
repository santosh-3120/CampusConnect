import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { connectSocket, onNewMessage } from '../services/socket';

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const { chatId } = useParams();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (user) {
      connectSocket(user._id);
      fetchChat();
      onNewMessage(({ chatId: incomingChatId, message: newMessage }) => {
        if (incomingChatId === chatId && newMessage.sender._id !== user._id) {
          setChat((prev) => ({
            ...prev,
            messages: [...prev.messages, newMessage],
            lastMessage: newMessage.createdAt,
          }));
        }
      });
    }
  }, [user, chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  const fetchChat = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/chats/messages/${chatId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setChat(response.data);
    } catch (err) {
      setError('Failed to load chat');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      const response = await axios.post(`http://localhost:3000/api/chats/message/${chatId}`, { text: message }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, response.data.message],
        lastMessage: response.data.message.createdAt,
      }));
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (!chat) return <div className="min-h-screen bg-blue-50 flex items-center justify-center">Loading...</div>;

  const otherUser = chat.participants.find(p => p._id !== user._id);

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
                to="/inbox"
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Inbox
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
        <h2 className="text-2xl font-bold text-gray-900 mid-4">Chat with {otherUser.name}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4">
            {chat.messages.length === 0 ? (
              <p className="text-gray-600 text-center">No messages yet. Say hi!</p>
            ) : (
              chat.messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender._id === user._id ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Type a message..."
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ChatCard from '../components/chats/ChatCard';
import {Spinner} from '../components/common/Spinner';
import { formatDate } from '../utils/formatDate';

const Chats = () => {
  const { user } = useContext(AuthContext);
  const { id: conversationId } = useParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3000/api/chats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setConversations(response.data);
        if (conversationId) {
          const conv = response.data.find(c => c._id === conversationId);
          if (conv) setSelectedConversation(conv);
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load conversations');
        setLoading(false);
      }
    };
    fetchConversations();
  }, [conversationId]);

  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/api/chats/${selectedConversation._id}/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          setMessages(response.data);
        } catch (err) {
          setError('Failed to load messages');
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/chats/${selectedConversation._id}/messages`,
        { text: newMessage },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white border-r border-gray-200">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-200">Conversations</h2>
        {conversations.length === 0 ? (
          <p className="p-4 text-gray-600">No conversations yet</p>
        ) : (
          conversations.map((conv) => (
            <ChatCard
              key={conv._id}
              conversation={conv}
              onClick={() => {
                setSelectedConversation(conv);
                navigate(`/chats/${conv._id}`);
              }}
              isSelected={selectedConversation?._id === conv._id}
            />
          ))
        )}
      </div>
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`mb-4 flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      msg.sender._id === user._id ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-70">{formatDate(msg.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary ml-2">Send</button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;
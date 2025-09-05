// components/chats/NewChatForm.jsx
import { useState } from 'react';
import axios from 'axios';

const NewChatForm = ({ onNewChat }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.get(`/api/auth/search?query=${searchTerm}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setResults(res.data);
  };

  const handleStartChat = async (userId) => {
    const token = localStorage.getItem('token');
    const res = await axios.post(`/api/chats/${userId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onNewChat(res.data);
    setResults([]);
    setSearchTerm('');
  };

  return (
    <div className="p-4 border-b border-gray-700">
      <input
        type="text"
        placeholder="Search users..."
        className="p-2 rounded w-full text-black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      {results.length > 0 && (
        <ul className="mt-2 bg-white text-black rounded shadow">
          {results.map((user) => (
            <li
              key={user._id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleStartChat(user._id)}
            >
              {user.name} ({user.rollNo})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NewChatForm;

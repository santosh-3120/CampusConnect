// src/components/ChatSearch.jsx
import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const ChatSearch = ({ onStartChat }) => {
  const { user } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Search users
    if (searchQuery.trim()) {
      axios.get(`/api/auth/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      }).then((res) => {
        setSearchResults(res.data);
      }).catch((err) => {
        console.error('Error searching users:', err);
      });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, user.token]);

  return (
    <div className="mb-6">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users..."
          className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {searchResults.length > 0 && (
        <div className="mt-2 bg-gray-800 rounded-lg shadow-lg p-4">
          {searchResults.map((result) => (
            <div
              key={result._id}
              onClick={() => onStartChat(result._id)}
              className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer transition"
            >
              {result.name} ({result.rollNo})
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatSearch;
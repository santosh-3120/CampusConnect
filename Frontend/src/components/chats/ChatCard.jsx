import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { formatDate } from '../../utils/formatDate';

const ChatCard = ({ conversation, onClick, isSelected }) => {
  const { user } = useContext(AuthContext);
  const otherParticipant = conversation.participants.find(p => p._id !== user._id);

  return (
    <div
      className={`card p-4 cursor-pointer ${isSelected ? 'bg-indigo-100' : 'hover:bg-gray-100'}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <img
          src={otherParticipant?.profileImage || 'https://placehold.co/40x40?text=User'}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-800">{otherParticipant?.name || 'Unknown'}</h3>
          <p className="text-sm text-gray-600 truncate">
            {conversation.lastMessage?.text || 'No messages yet'}
          </p>
          <p className="text-xs text-gray-500">{formatDate(conversation.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
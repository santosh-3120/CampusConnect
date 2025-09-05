// src/components/chats/ChatListItem.jsx
import { Link } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';

const ChatListItem = ({ chat, currentUserId }) => {
  let otherParticipant = null;

  if (Array.isArray(chat.participants)) {
    otherParticipant = chat.participants.find(
      (p) => p?._id && p._id.toString() !== currentUserId?.toString()
    );
  }

  const displayName =
    otherParticipant?.name ||
    otherParticipant?.user?.name ||
    "Unknown User";

  const lastMessage =
    chat.messages && chat.messages.length > 0
      ? chat.messages[chat.messages.length - 1].text.slice(0, 50)
      : "No messages yet";

  return (
    <Link
      to={`/chats/${chat._id}`}
      className="block bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
    >
      <div className="flex items-center">
        <FaComments className="text-2xl text-yellow-400 mr-3" />
        <div>
          <h3 className="text-lg font-semibold">{displayName}</h3>
          <p className="text-sm text-gray-300">{lastMessage}</p>
        </div>
      </div>
    </Link>
  );
};

export default ChatListItem;

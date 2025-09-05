import { useEffect } from 'react';
import SocketService from '../../services/SocketService';

const ChatList = ({ chats, setSelectedChat, userId }) => {
  useEffect(() => {
    SocketService.connect(localStorage.getItem('token'));
    SocketService.on('newChat', (chat) => {
      setSelectedChat((prev) => [chat, ...prev.filter((c) => c._id !== chat._id)]);
    });
    return () => SocketService.disconnect();
  }, [setSelectedChat]);

  return (
    <div className="w-1/3 border-r border-gray-700 overflow-y-auto bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Your Chats</h2>
      {chats.map((chat) => {
        const otherUser = chat.participants.find(p => p._id !== userId);
        return (
          <div
            key={chat._id}
            className="mb-3 p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
            onClick={() => setSelectedChat(chat)}
          >
            <p className="font-semibold">{otherUser?.name || 'Unknown'}</p>
            <p className="text-sm text-gray-300">
              {chat.messages?.length > 0 ? chat.messages[chat.messages.length - 1].text : 'No messages yet'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
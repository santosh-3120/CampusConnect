import { useEffect, useRef, useState } from 'react';
import { sendMessage, getChatMessages } from '../../services/chatService';
import Message from './Message';
import SocketService from '../../services/SocketService';

const ChatBox = ({ chat, user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const chatBottomRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      if (chat?._id) {
        const data = await getChatMessages(chat._id);
        setMessages(data.messages || []);
      }
    };
    fetchMessages();
  }, [chat]);

  useEffect(() => {
    if (user?.token && chat?._id) {
      SocketService.connect(user.token);
      SocketService.on('newMessage', (data) => {
        if (data.chatId === chat._id) {
          setMessages((prev) => {
            if (prev.some((msg) => msg._id === data.message._id)) {
              return prev;
            }
            return [...prev, data.message];
          });
        }
      });
      return () => SocketService.disconnect();
    }
  }, [chat, user]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const res = await sendMessage(chat._id, input);
    setMessages((prev) => {
      if (prev.some((msg) => msg._id === res.message._id)) {
        return prev;
      }
      return [...prev, res.message];
    });
    setInput('');
  };

  if (!chat) {
    return <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat to start messaging</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 p-4">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} currentUserId={user._id} />
        ))}
        <div ref={chatBottomRef} />
      </div>
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-700 text-white p-2 rounded-l"
        />
        <button onClick={handleSend} className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
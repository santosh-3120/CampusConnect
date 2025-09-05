const Message = ({ message, currentUserId }) => {
  // Normalize sender ID (handles string or object for sender)
  const senderId = message.sender?._id || message.sender;

  // Determine if the message is from the current user
  const isOwnMessage = senderId === currentUserId;

  return (
    <div
      className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs md:max-w-md p-3 rounded-lg shadow ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p>{message.text}</p>
        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-gray-100' : 'text-gray-500'}`}>
          {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default Message;
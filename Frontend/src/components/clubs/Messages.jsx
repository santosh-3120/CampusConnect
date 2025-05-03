import { useState, useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';

function Messages({
  messages,
  isLoading,
  error,
  canPost,
  canDelete,
  onSubmit,
  newMessage,
  setNewMessage,
  onDelete
}) {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedInsideAny = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );
      if (!clickedInsideAny) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (msgId) => {
    setOpenDropdownId(openDropdownId === msgId ? null : msgId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    onSubmit(e);
  };

  const hasMessages = messages && messages.length > 0;
  const showError = error && !isLoading && messages === undefined;

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Club Messages</h2>

      {isLoading && <p>Loading messages...</p>}
      {showError && <p className="text-red-500">{error}</p>}
      {!isLoading && !hasMessages && !showError && (
        <p className="text-gray-500">No messages yet.</p>
      )}

      {hasMessages && (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className="bg-white p-3 border rounded shadow-sm relative group"
              ref={(el) => (dropdownRefs.current[msg._id] = el)}
            >
              {canDelete && (
                <>
                  <button
                    onClick={() => toggleDropdown(msg._id)}
                    className="absolute top-2 right-2 p-1 rounded-full cursor-pointer text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition"
                    title="Options"
                  >
                    <MoreVertical size={20} />
                  </button>

                  {openDropdownId === msg._id && (
                    <div className="absolute right-2 top-8 bg-white border rounded shadow-md z-10">
                      <button
                        onClick={() => {
                          setOpenDropdownId(null);
                          if (window.confirm('Are you sure you want to delete this message?')) {
                            onDelete?.(msg._id);
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}

              <p className="text-gray-800">{msg.content}</p>
              <p className="text-xs text-gray-500 mt-2">
                <span className="font-semibold text-gray-700">By: </span>{msg.author?.name || 'Unknown'} &nbsp;|&nbsp;
                <span>
                  {new Date(msg.createdAt).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })} &nbsp;|&nbsp;
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}

      {canPost && (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Write a message..."
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
          >
            Post Message
          </button>
        </form>
      )}
    </div>
  );
}

export default Messages;
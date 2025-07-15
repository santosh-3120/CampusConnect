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
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-yellow-300 mb-4">Club Messages</h2>

      {isLoading && <p className="text-gray-300">Loading messages...</p>}
      {showError && <p className="text-red-400">{error}</p>}
      {!isLoading && !hasMessages && !showError && (
        <p className="text-gray-400 italic">No messages yet.</p>
      )}

      {hasMessages && (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li
              key={msg._id}
              className="relative group p-4 bg-white/10 text-white rounded-xl backdrop-blur-sm shadow-lg border border-white/20"
              ref={(el) => (dropdownRefs.current[msg._id] = el)}
            >
              {canDelete && (
                <>
                  <button
                    onClick={() => toggleDropdown(msg._id)}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 text-white transition"
                    title="Options"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {openDropdownId === msg._id && (
                    <div className="absolute right-2 top-9 bg-white text-sm text-gray-800 rounded shadow-md z-10">
                      <button
                        onClick={() => {
                          setOpenDropdownId(null);
                          if (window.confirm('Are you sure you want to delete this message?')) {
                            onDelete?.(msg._id);
                          }
                        }}
                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </>
              )}

              <p className="text-white">{msg.content}</p>
              <p className="text-xs text-gray-300 mt-2">
                <span className="font-semibold text-yellow-300">By: </span>
                {msg.author?.name || 'Unknown'} &nbsp;|&nbsp;
                <span>
                  {new Date(msg.createdAt).toLocaleDateString(undefined, {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}{' '}
                  •{' '}
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}

      {canPost && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/20"
        >
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="Write a message..."
            rows={3}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="mt-3 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Message
          </button>
        </form>
      )}
    </div>
  );
}

export default Messages;

export const Messageitem = (msg) => {
  console.log(msg)
  return (
    <li
      key={msg._id}
      className='relative group p-4 bg-white/10 text-white rounded-xl backdrop-blur-sm shadow-lg border border-white/20'
      ref={(el) => (dropdownRefs.current[msg._id] = el)}
    >
      {canDelete && (
        <>
          <button
            onClick={() => toggleDropdown(msg._id)}
            className='absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 text-white transition'
            title='Options'
          >
            <MoreVertical size={18} />
          </button>

          {openDropdownId === msg._id && (
            <div className='absolute right-2 top-9 bg-white text-sm text-gray-800 rounded shadow-md z-10'>
              <button
                onClick={() => {
                  setOpenDropdownId(null);
                  if (
                    window.confirm(
                      "Are you sure you want to delete this message?"
                    )
                  ) {
                    onDelete?.(msg._id);
                  }
                }}
                className='block w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 rounded-b'
              >
                Delete
              </button>
            </div>
          )}
        </>
      )}

      <p className='text-white'>{msg.content}</p>
      <p className='text-xs text-gray-300 mt-2'>
        <span className='font-semibold text-yellow-300'>By: </span>
        {msg.author?.name || "Unknown"} &nbsp;|&nbsp;
        <span>
          {new Date(msg.createdAt).toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}{" "}
          •{" "}
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </span>
      </p>
    </li>
  );
};

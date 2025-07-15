import React from 'react';

const FollowersModal = ({ followers, onClose, onRemove, isAdmin }) => {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Followers</h2>
        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {followers.map((follower) => (
            <li
              key={follower.id}
              className="flex justify-between border-black border-2 items-center p-2 rounded"
            >
              <div>
                <p className="text-black  font-medium">{follower.name}</p>
                <p className="text-sm text-gray-500">{follower.rollNo}</p>
              </div>
              {isAdmin && (
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  onClick={() => onRemove(follower.id)}
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowersModal;
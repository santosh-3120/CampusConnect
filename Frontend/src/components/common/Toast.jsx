import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'error', onDismiss }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    setVisible(!!message);
    if (message) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onDismiss]);

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
        type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
      }`}
    >
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          if (onDismiss) onDismiss();
        }}
        className="text-white hover:text-gray-200"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;
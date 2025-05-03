import React from 'react';

export const Toast = ({ message, type }) => {
  const bgColor = type === 'error' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className={`fixed bottom-4 right-4 p-4 text-white rounded-md ${bgColor}`}>
      {message}
    </div>
  );
};
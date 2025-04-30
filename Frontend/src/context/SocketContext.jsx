import React from 'react';

import { createContext, useEffect } from 'react';
import socket, { connectSocket, disconnectSocket } from '../services/socket';

// Create the SocketContext
export const SocketContext = createContext(null);

// Provider component to wrap the app or components
export const SocketProvider = ({ children }) => {
  useEffect(() => {
    connectSocket(); // Connect to Socket.io server on mount
    return () => disconnectSocket(); // Disconnect on unmount
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
import React from 'react';

import { createContext, useState } from 'react';

// Create the AuthContext
export const AuthContext = createContext(null);

// Provider component to wrap the app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    _id: 'mockUser',
    name: 'Mock User',
    rollNo: 'A123',
  }); // Mock user for testing

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
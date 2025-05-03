import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:3000/api/auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(response => setUser(response.data.user))
        .catch(() => localStorage.removeItem('token'));
    }
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
  };

  const register = async (name, email, rollNo, password, role) => {
    await axios.post('http://localhost:3000/api/auth/register', { name, email, rollNo, password, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
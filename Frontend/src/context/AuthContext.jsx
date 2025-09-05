// // src/context/AuthContext.js
// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.get('/api/auth/dashboard', {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//         .then((response) => {
//           setUser({ ...response.data.user, token }); // Store token in user
//         })
//         .catch(() => {
//           localStorage.removeItem('token');
//           setUser(null); // Reset user on error
//         });
//     }
//   }, []);

//   const login = async (email, password) => {
//     const response = await axios.post('/api/auth/login', { email, password });
//     localStorage.setItem('token', response.data.token);
//     setUser({ ...response.data.user, token: response.data.token });
//   };

//   const register = async (name, email, rollNo, password, role) => {
//     await axios.post('/api/auth/register', { name, email, rollNo, password, role });
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// // import { createContext, useState, useEffect } from "react";
// // import axios from "axios";

// // export const AuthContext = createContext(null);

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(undefined); // undefined while loading
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const storedUser = localStorage.getItem("user");
// //     const token = localStorage.getItem("token");

// //     if (storedUser && token) {
// //       setUser(JSON.parse(storedUser));

// //       // Verify token with backend
// //       axios
// //         .get("http://localhost:3000/api/auth/dashboard", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         })
// //         .then((res) => {
// //           setUser(res.data.user);
// //           localStorage.setItem("user", JSON.stringify(res.data.user));
// //         })
// //         .catch(() => {
// //           localStorage.removeItem("user");
// //           localStorage.removeItem("token");
// //           setUser(null);
// //         })
// //         .finally(() => setLoading(false));
// //     } else {
// //       setUser(null);
// //       setLoading(false);
// //     }
// //   }, []);

// //   const login = async (email, password) => {
// //     const response = await axios.post("http://localhost:3000/api/auth/login", {
// //       email,
// //       password,
// //     });

// //     const { user, token } = response.data;
// //     setUser(user);
// //     localStorage.setItem("user", JSON.stringify(user));
// //     localStorage.setItem("token", token);
// //   };

// //   const register = async (name, email, rollNo, password, role) => {
// //     await axios.post("http://localhost:3000/api/auth/register", {
// //       name,
// //       email,
// //       rollNo,
// //       password,
// //       role,
// //     });
// //   };

// //   const logout = () => {
// //     localStorage.removeItem("user");
// //     localStorage.removeItem("token");
// //     setUser(null);
// //   };

// //   return (
// //     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined while loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('/api/auth/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        const u = { ...res.data.user, token }; // always merge token
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      })
      .catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      })
      .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const u = { ...res.data.user, token: res.data.token };
    setUser(u);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


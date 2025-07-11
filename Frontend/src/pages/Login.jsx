import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 font-sans text-white">
      <div className="bg-indigo-900 bg-opacity-60 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md border border-white border-opacity-20">
        <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow">
          Login to CampusConnect
        </h2>
        {error && (
          <p className="text-red-400 mb-4 text-center font-medium">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-white font-semibold mb-2 drop-shadow"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white font-semibold mb-2 drop-shadow"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-black bg-opacity-30 border border-white border-opacity-30 rounded-lg placeholder-white placeholder-opacity-70 text-white focus:outline-none focus:ring-2 focus:ring-blue-300 backdrop-blur"
              placeholder="Your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-white">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-yellow-300 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

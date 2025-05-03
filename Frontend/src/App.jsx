import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inbox from './pages/Inbox.jsx';
import Chat from './pages/Chat.jsx';
import LostAndFound from './pages/LostAndFound.jsx'; // Added for Lost and Found
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LostAndFoundDetails from './pages/LostAndFoundDetails.jsx';
import createLostFound from './pages/CreateLostFound.jsx';
import CreateLostFound from './pages/CreateLostFound.jsx';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lost-and-found/new"
          element={
            <ProtectedRoute>
              <CreateLostFound />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lost-and-found"
          element={
            <ProtectedRoute>
              <LostAndFound />
            </ProtectedRoute>
          }
        />

<Route
  path="/lost-and-found/:id"
  element={
    <ProtectedRoute>
      <LostAndFoundDetails />
    </ProtectedRoute>
  }
/>

        <Route
          path="*"
          element={
            <div className="container mx-auto p-6 text-center text-gray-600">
              Page Not Found
            </div>
          }
        />


      </Routes>
    </div>
  );
}

export default App;
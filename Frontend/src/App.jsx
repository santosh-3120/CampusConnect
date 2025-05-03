import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import Marketplace from './pages/Marketplace';
import MarketplaceItem from './pages/MarketplaceItem';
import CreateItem from './pages/CreateItem';
import MarketplaceDashboard from './pages/MarketplaceDashboard';
import LostAndFound from './pages/LostAndFound';
import LostAndFoundDetails from './pages/LostAndFoundDetails';
import CreateLostFound from './pages/CreateLostFound';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import ClubManage from './pages/ClubManage';
import Forum from './pages/Forum';
import ForumQuestion from './pages/ForumQuestion';
import CreateQuestion from './pages/CreateQuestion';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Chats from './pages/Chats';
import ProtectedRoute from './components/layout/ProtectedRoute';
import './index.css';


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route
              path="/events/new"
              element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}
            />
            <Route
              path="/events/edit/:id"
              element={<ProtectedRoute><CreateEvent /></ProtectedRoute>}
            />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<MarketplaceItem />} />
            <Route
              path="/marketplace/create"
              element={<ProtectedRoute><CreateItem /></ProtectedRoute>}
            />
            <Route
              path="/marketplace/dashboard"
              element={<ProtectedRoute><MarketplaceDashboard /></ProtectedRoute>}
            />
            <Route path="/lost-and-found" element={<LostAndFound />} />
            <Route path="/lost-and-found/:id" element={<LostAndFoundDetails />} />
            <Route
              path="/lost-and-found/create"
              element={<ProtectedRoute><CreateLostFound /></ProtectedRoute>}
            />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/clubs/:id" element={<ClubDetails />} />
            <Route
              path="/club-manage/:id?"
              element={<ProtectedRoute requiredRole="admin"><ClubManage /></ProtectedRoute>}
            />
            <Route path="/forum" element={<Forum />} />
            <Route path="/forum/:id" element={<ForumQuestion />} />
            <Route
              path="/forum/new"
              element={<ProtectedRoute><CreateQuestion /></ProtectedRoute>}
            />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/chats/:id?" element={<ProtectedRoute><Chats /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
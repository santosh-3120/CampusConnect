import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Inbox from './pages/Inbox.jsx';
import Chat from './pages/Chat.jsx';
import LostAndFound from './pages/LostAndFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LostAndFoundDetails from './pages/LostAndFoundDetails.jsx';
import CreateLostFound from './pages/CreateLostFound.jsx';
import  Marketplace  from './pages/Marketplace';
import  MarketplaceItem  from './pages/MarketplaceItem';
import  CreateItem  from './pages/CreateItem';
import  MarketplaceDashboard  from './pages/MarketplaceDashboard.jsx';
import Clubs from './pages/Clubs';
import ClubDetails from './pages/ClubDetails';
import ClubManage from './pages/ClubManage';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import CreateEvent from './pages/CreateEvent.jsx';
import Home from './pages/Home.jsx';


function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
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
<Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:id" element={<MarketplaceItem />} />
        {/* <Route path="/marketplace/dashboard" element={<MarketplaceDashboard />} /> */}
        <Route
          path="/marketplace/create"
          element={
            <ProtectedRoute>
              <CreateItem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace/dashboard"
          element={
            <ProtectedRoute>
              <MarketplaceDashboard />
            </ProtectedRoute>
          }
        />

<Route
          path="/clubs"
          element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clubs/:id"
          element={
            <ProtectedRoute>
              <ClubDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/club-manage/:id?"
          element={
            <ProtectedRoute requiredRole="admin">
              <ClubManage />
            </ProtectedRoute>
          }
        />

<Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route
          path="/events/new"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/edit/:id"
          element={
            <ProtectedRoute>
              <CreateEvent />
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
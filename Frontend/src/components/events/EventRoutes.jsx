import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Events from '../../pages/Events';
import EventDetails from '../../pages/EventDetails';
import CreateEvent from '../../pages/CreateEvent';
import ProtectedRoute from '../layout/ProtectedRoute';

const EventRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Events />} />
      <Route path="/:id" element={<EventDetails />} />
      <Route
        path="/new"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/edit/:id"
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
            Event Page Not Found
          </div>
        }
      />
    </Routes>
  );
};

export default EventRoutes;
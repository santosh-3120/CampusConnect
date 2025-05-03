import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useEvents, useEventActions } from '../features/events/eventsHooks';
import { AuthContext } from '../context/AuthContext';
import EventCard from '../components/events/EventCard';
import EventFilter from '../components/events/EventFilter';
import {Spinner} from '../components/common/Spinner';
import {Toast} from '../components/common/Toast';

const Events = () => {
  const { events, loading, error, refetch } = useEvents();
  const { deleteEvent } = useEventActions();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin' || user?.role === 'club_coordinator';
  const [filters, setFilters] = useState({ date: '', location: '' });
  const [errorMessage, setErrorMessage] = useState(null);

  // Update local errorMessage when the useEvents error changes
  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        refetch();
      } catch (err) {
        // Error is handled by useEventActions
      }
    }
  };

  const handleDismiss = () => {
    console.log('Toast dismissed');
    setErrorMessage(null);
  };

  const filteredEvents = events.filter((event) => {
    const matchesDate = filters.date
      ? new Date(event.date).toISOString().split('T')[0] === filters.date
      : true;
    const matchesLocation = filters.location
      ? event.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;
    return matchesDate && matchesLocation;
  });

  return (
    <div
      className="container mx-auto p-4 text-gray-100 min-h-screen bg-gray-900"
    >
      {/* Centered Title with Glass Effect and Gradient Text */}
      <div className="text-center mb-6">
        <h1 className="inline-block text-4xl font-extrabold bg-gray-800/50 backdrop-blur-md border border-gray-600/50 rounded-lg px-6 py-3 shadow-md bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
          Events
        </h1>
      </div>

      {/* Create Event Button and Filter */}
      <div className="flex flex-col items-center mb-6 space-y-4">
        {isAdmin && (
          <Link
            to="/events/new"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Create Event
          </Link>
        )}
        <EventFilter onFilter={setFilters} />
      </div>

      {loading && <Spinner />}
      {errorMessage && (
        <Toast
          message={errorMessage}
          type="error"
          onDismiss={handleDismiss}
        />
      )}
      {filteredEvents.length === 0 ? (
        <p className="text-gray-400 text-center bg-gray-800/50 backdrop-blur-md border border-gray-600/50 rounded-lg p-3 shadow-md inline-block">
          No events found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
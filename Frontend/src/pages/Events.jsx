import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents, useEventActions } from '../features/events/eventsHooks';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/events/EventCard';
import EventFilter from '../components/events/EventFilter';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const Events = () => {
  const [filters, setFilters] = useState({});
  const { events, loading, error } = useEvents(filters);
  const { deleteEvent } = useEventActions();

  const handleFilter = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <Link to="/events/new" className="btn-primary">Create Event</Link>
        </div>
        {error && <Toast message={error} type="error" />}
        <EventFilter onFilter={handleFilter} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event._id} event={event} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
import React from 'react';
import { useParams } from 'react-router-dom';
import { useEvent, useEventActions } from '../features/events/eventsHooks';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/events/EventCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const EventDetails = () => {
  const { id } = useParams();
  const { event, loading, error } = useEvent(id);
  const { deleteEvent } = useEventActions();

  const handleDelete = async () => {
    try {
      await deleteEvent(id);
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <div className="text-center text-red-500">Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        {error && <Toast message={error} type="error" />}
        <EventCard event={event} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default EventDetails;
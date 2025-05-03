import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../features/events/eventsHooks';
import { useItems } from '../features/marketplace/marketplaceHooks';
import Navbar from '../components/layout/Navbar';
import EventCard from '../components/events/EventCard';
import ItemCard from '../components/marketplace/ItemCard';
import Spinner from '../components/common/Spinner';
import Toast from '../components/common/Toast';

const Dashboard = () => {
  const { events, loading: eventsLoading, error: eventsError } = useEvents();
  const { items, loading: itemsLoading, error: itemsError } = useItems();

  if (eventsLoading || itemsLoading) return <Spinner />;
  if (eventsError || itemsError) return <Toast message={eventsError || itemsError} type="error" />;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 mt-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.slice(0, 3).map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Marketplace</h2>
            <Link to="/marketplace" className="text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.slice(0, 3).map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
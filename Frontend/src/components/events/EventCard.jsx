import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import RSVPButton from './RSVPButton';
import { formatDate } from '../../utils/formatDate';

const EventCard = ({ event, onDelete }) => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin' || user?.role === 'club_coordinator';
  const isRSVPed = event.rsvps.includes(user?._id);

  // Fallback image for events without an image or invalid URLs
  const fallbackImage = 'https://placehold.co/300x160?text=No+Image';

  return (
    <div className="bg-gray-800/90 rounded-lg shadow-md p-4 hover:shadow-lg transition">
      <img
        src={event.image || fallbackImage}
        alt={event.title}
        className="w-full h-40 object-cover rounded-t-lg"
        onError={(e) => {
          if (e.target.src !== fallbackImage) {
            e.target.src = fallbackImage;
          }
        }}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-100">{event.title}</h3>
        <p className="text-gray-400 mt-1 line-clamp-2">{event.description}</p>
        <p className="text-sm text-gray-300 mt-2">
          <strong>Date:</strong> {formatDate(event.date)}
        </p>
        <p className="text-sm text-gray-300">
          <strong>Location:</strong> {event.location}
        </p>
        <p className="text-sm text-gray-300">
          <strong>RSVPs:</strong> {event.rsvps.length}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <Link
            to={`/events/${event._id}`}
            className="text-green-400 font-medium hover:underline text-sm"
          >
            View Details
          </Link>
          <div className="flex items-center gap-3">
            {!isRSVPed && <RSVPButton eventId={event._id} />}
            {isAdmin && (
              <>
                <Link
                  to={`/events/edit/${event._id}`}
                  className="text-yellow-400 hover:underline text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(event._id)}
                  className="text-red-400 hover:underline text-sm"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;

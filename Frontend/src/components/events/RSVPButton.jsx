import React from 'react';
import axios from 'axios';

const RSVPButton = ({ eventId }) => {
  const handleRSVP = async () => {
    try {
      await axios.post(
        `http://localhost:3000/api/events/${eventId}/rsvp`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      // Ideally, refetch event data
    } catch (err) {
      console.error('Error RSVPing:', err);
    }
  };

  return (
    <button onClick={handleRSVP} className="btn-primary">
      RSVP
    </button>
  );
};

export default RSVPButton;
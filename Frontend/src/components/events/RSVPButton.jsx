import React, { useState } from 'react';
import { useEventActions } from '../../features/events/eventsHooks';
import {Toast} from '../common/Toast';

const RSVPButton = ({ eventId }) => {
  const { rsvp, loading, error } = useEventActions();
  const [showToast, setShowToast] = useState(false);

  const handleRSVP = async () => {
    try {
      await rsvp(eventId);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      // Error is handled by useEventActions
    }
  };

  return (
    <>
      <button
        onClick={handleRSVP}
        disabled={loading}
        className={`px-4 py-2 rounded-lg text-white ${
          loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } transition`}
      >
        {loading ? 'RSVPing...' : 'RSVP'}
      </button>
      {showToast && <Toast message="RSVP successful!" type="success" />}
      {error && <Toast message={error} type="error" />}
    </>
  );
};

export default RSVPButton;
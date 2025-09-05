import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import {
  getAllEvents,
  getEventById,
  createEvent as apiCreateEvent,
  updateEvent as apiUpdateEvent,
  deleteEvent as apiDeleteEvent,
  rsvpEvent as apiRsvpEvent
} from './eventsAPI';

// Hook to manage events
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    console.log(events)
    try {
      const data = await getAllEvents();
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, refetch: loadEvents };
};

// Hook to manage single event details
export const useEvent = (id) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getEventById(id);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadEvent();
  }, [id, loadEvent]);

  const refetch = useCallback(() => {
    if (id) loadEvent();
  }, [id, loadEvent]);

  return { event, loading, error, refetch };
};

// ✅ Hook for performing event actions (with fixed naming)
export const useEventActions = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateEvent = async (eventData) => {
    setLoading(true);
    try {
      const response = await apiCreateEvent(eventData);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEvent = async (id, eventData) => {
    setLoading(true);
    try {
      const response = await apiUpdateEvent(id, eventData);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id) => {
    setLoading(true);
    try {
      const response = await apiDeleteEvent(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRsvp = async (id) => {
    setLoading(true);
    try {
      const response = await apiRsvpEvent(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    rsvp: handleRsvp,
    loading,
    error
  };
};

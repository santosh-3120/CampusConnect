import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent, rsvpEvent } from './eventsAPI';

// Hook to manage events
export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load events function
  const loadEvents = useCallback(async () => {
    setLoading(true);
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

  // Trigger loadEvents once when the component mounts
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

  // Load event function
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

  // Load event when ID changes or is set initially
  useEffect(() => {
    if (id) loadEvent();
  }, [id, loadEvent]);

  // Refetch the event data
  const refetch = useCallback(() => {
    if (id) loadEvent();
  }, [id, loadEvent]);

  return { event, loading, error, refetch };
};

// Hook for performing event actions like creating, updating, deleting, or RSVPing
export const useEventActions = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create event function
  const createEvent = async (eventData) => {
    setLoading(true);
    try {
      const response = await createEvent(eventData);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update event function
  const updateEvent = async (id, eventData) => {
    setLoading(true);
    try {
      const response = await updateEvent(id, eventData);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete event function
  const deleteEvent = async (id) => {
    setLoading(true);
    try {
      const response = await deleteEvent(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // RSVP to event function
  const rsvp = async (id) => {
    setLoading(true);
    try {
      const response = await rsvpEvent(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, updateEvent, deleteEvent, rsvp, loading, error };
};
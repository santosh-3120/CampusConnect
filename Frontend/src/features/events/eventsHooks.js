import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchEvents, fetchEventById, addEvent, editEvent, deleteEvent } from './eventsAPI';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents(filters);
      setEvents(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, refetch: loadEvents };
};

export const useEvent = (id) => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEventById(id);
      setEvent(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadEvent();
  }, [id, loadEvent]);

  return { event, loading, error, refetch: loadEvent };
};

export const useEventActions = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createEvent = async (eventData) => {
    setLoading(true);
    try {
      const response = await addEvent({ ...eventData, organizer: user._id });
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, eventData) => {
    setLoading(true);
    try {
      const response = await editEvent(id, eventData);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = async (id) => {
    setLoading(true);
    try {
      const response = await deleteEvent(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, updateEvent, deleteEvent: removeEvent, loading, error };
};
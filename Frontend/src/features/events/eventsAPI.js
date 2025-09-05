// src/api/eventApi.js
import api from '../../services/api';

// Create event
export const createEvent = async (eventData) => {
  const isFormData = eventData instanceof FormData;
  return api
    .post('/events', eventData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('createEvent API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to create event');
    });
};

// Update event
export const updateEvent = (id, eventData) => {
  const isFormData = eventData instanceof FormData;
  return api
    .put(`/events/${id}`, eventData, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('updateEvent API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to update event');
    });
};

// Delete event
export const deleteEvent = (id) =>
  api
    .delete(`/events/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('deleteEvent API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to delete event');
    });

// Get all events
export const getAllEvents = () =>
  api
    .get('/events')
    .then((res) => res.data)
    .catch((err) => {
      console.error('getAllEvents API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch events');
    });

// Get event by ID
export const getEventById = (id) =>
  api
    .get(`/events/${id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('getEventById API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to fetch event');
    });

// RSVP to event
export const rsvpEvent = (id) =>
  api
    .post(`/events/${id}/rsvp`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('rsvpEvent API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to RSVP');
    });

// Post a comment on event
export const postComment = (id, formData) =>
  api
    .post(`/events/${id}/comments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error('postComment API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to post comment');
    });

// Toggle like on event
export const toggleLike = (id) =>
  api
    .post(`/events/${id}/like`)
    .then((res) => res.data)
    .catch((err) => {
      console.error('toggleLike API error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.message || 'Failed to toggle like');
    });

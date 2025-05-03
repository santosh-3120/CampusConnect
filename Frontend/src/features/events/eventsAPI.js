import axios from 'axios';

export const fetchEvents = async (filters = {}) => {
  const response = await axios.get('http://localhost:3000/api/events', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params: filters,
  });
  return response.data;
};

export const fetchEventById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/events/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const addEvent = async (eventData) => {
  const response = await axios.post('http://localhost:3000/api/events', eventData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const editEvent = async (id, eventData) => {
  const response = await axios.put(`http://localhost:3000/api/events/${id}`, eventData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api/events/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
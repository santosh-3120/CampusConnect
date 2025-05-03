import axios from 'axios';

export const fetchClubs = async () => {
  const response = await axios.get('http://localhost:3000/api/clubs', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const fetchClubById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/clubs/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const addClub = async (clubData) => {
  const response = await axios.post('http://localhost:3000/api/clubs', clubData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const editClub = async (id, clubData) => {
  const response = await axios.put(`http://localhost:3000/api/clubs/${id}`, clubData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const joinClub = async (id) => {
  const response = await axios.post(`http://localhost:3000/api/clubs/${id}/join`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const leaveClub = async (id) => {
  const response = await axios.post(`http://localhost:3000/api/clubs/${id}/leave`, {}, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
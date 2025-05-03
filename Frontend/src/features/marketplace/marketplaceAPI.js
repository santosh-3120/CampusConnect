import axios from 'axios';

export const fetchItems = async (filters = {}) => {
  const response = await axios.get('http://localhost:3000/api/marketplace', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    params: filters,
  });
  return response.data;
};

export const fetchItemById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/marketplace/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const addItem = async (itemData) => {
  const response = await axios.post('http://localhost:3000/api/marketplace', itemData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const editItem = async (id, itemData) => {
  const response = await axios.put(`http://localhost:3000/api/marketplace/${id}`, itemData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api/marketplace/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
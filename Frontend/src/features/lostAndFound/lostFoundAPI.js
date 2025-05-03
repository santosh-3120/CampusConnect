import api from '../../services/api';

export const fetchItems = async () => {
  const response = await api.get('/lost-found');
  return response.data;
};

export const fetchItem = async (id) => {
  const response = await api.get(`/lost-found/${id}`);
  return response.data;
};

export const createItem = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'image' && data[key]) {
      formData.append('image', data[key]);
    } else if (data[key]) {
      formData.append(key, data[key]);
    }
  });
  const response = await api.post('/lost-found', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateItem = async (id, data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === 'image' && data[key]) {
      formData.append('image', data[key]);
    } else if (data[key]) {
      formData.append(key, data[key]);
    }
  });
  const response = await api.put(`/lost-found/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteItem = async (id) => {
  await api.delete(`/lost-found/${id}`);
};

export const addComment = async (id, text) => {
  const response = await api.post(`/lost-found/${id}/comments`, { text });
  return response.data;
};

export const claimItem = async (id) => {
  const response = await api.post(`/lost-found/${id}/claim`);
  return response.data;
};
import api from '../../services/api';

export const fetchItems = async (filters = {}) => {
  try {
    const response = await api.get('/lost-found', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
};

export const fetchItem = async (id) => {
  try {
    const response = await api.get(`/lost-found/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item');
  }
};

export const createItem = async (data) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key]) {
        formData.append('image', data[key]);
      } else if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post('/lost-found', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to create item');
  }
};

export const updateItem = async (id, data) => {
  try {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === 'image' && data[key]) {
        formData.append('image', data[key]);
      } else if (data[key] !== undefined && data[key] !== null && data[key] !== '') {
        formData.append(key, data[key]);
      }
    });

    const response = await api.put(`/lost-found/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update item');
  }
};

export const deleteItem = async (id) => {
  try {
    const token = localStorage.getItem('token');
    await api.delete(`/lost-found/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return { success: true, message: 'Item deleted successfully' };
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to delete item');
  }
};

export const addComment = async (id, text) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      `/lost-found/${id}/comments`,
      { text },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add comment');
  }
};

export const claimItem = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post(
      `/lost-found/${id}/claim`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to claim item');
  }
};
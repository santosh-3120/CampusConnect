import api from '../../services/api'; // Named import

export const fetchItems = async (filters = {}) => {
  try {
    const response = await api.get('/marketplace', { params: filters });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch items');
  }
};

export const fetchItemById = async (id) => {
  try {
    const response = await api.get(`/marketplace/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch item');
  }
};

export const createItem = async (formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/marketplace/items', formData, {
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

export const updateItem = async (id, formData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put(`/marketplace/${id}`, formData, {
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

export const markItemAsSold = async (id) => {
  try {
    const token = localStorage.getItem('token');
    console.log("Id: " + id);
    const response = await api.patch(`/marketplace/${id}/sold`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to mark item as sold');
  }
};

export const fetchUserItems = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/marketplace/dashboard/my-items', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user items');
  }
};

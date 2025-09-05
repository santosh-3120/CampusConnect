// src/features/lostAndFound/lostFoundHooks.js
import { useState, useEffect } from 'react';
import {
  fetchItems,
  fetchItem,
  createItem as createItemAPI,
  updateItem as updateItemAPI,
  deleteItem as deleteItemAPI,
  addComment as addCommentAPI,
  claimItem as claimItemAPI,
} from './lostFoundAPI';

// Helper: detect File in browser
const isFile = (v) => typeof File !== 'undefined' && v instanceof File;

// Helper: convert datetime-local ("yyyy-mm-ddThh:mm" or with seconds) to full ISO string
const datetimeLocalToISOString = (s) => {
  if (!s) return null;
  let value = s;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    value = value + ':00';
  }
  const dt = new Date(value);
  if (isNaN(dt.getTime())) return null;
  return dt.toISOString();
};

// ------------------- HOOKS ------------------- //

// Fetch all items
export const useLostFoundItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItems = async () => {
      setLoading(true);
      try {
        const data = await fetchItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  return { items, loading, error };
};

// Fetch single item by ID
export const useLostFoundItem = (id) => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const data = await fetchItem(id);
      setItem(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetch();
  }, [id]);

  return { item, loading, error, refetch: fetch };
};

// Hook for updating a lost & found item
export const useUpdateLostFoundItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateLostFoundItem = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateItem(id, data);
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateLostFoundItem, loading, error };
};

// ------------------- FUNCTIONS ------------------- //

// Create new item
export const createItem = async (data) => {
  const payload = { ...data };
  if (payload.date) {
    const iso = datetimeLocalToISOString(payload.date);
    if (iso) payload.date = iso;
  }
  const response = await createItemAPI(payload);
  return response;
};

// Update item (FormData handled)
export const updateItem = async (id, data) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    const value = data[key];
    if (value === undefined || value === null) return;

    if (key === 'image') {
      if (isFile(value)) formData.append('image', value);
      return;
    }

    if (key === 'date') {
      const iso = datetimeLocalToISOString(value);
      if (iso) formData.append('date', iso);
      return;
    }

    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return;
      formData.append(key, trimmed);
      return;
    }

    formData.append(key, value);
  });

  const updatedItem = await updateItemAPI(id, formData);
  return updatedItem;
};

// Delete item
export const deleteItem = async (id) => {
  const response = await deleteItemAPI(id);
  return response;
};

// Add comment
export const addComment = async (id, text) => {
  const response = await addCommentAPI(id, text);
  return response;
};

// Claim item
export const claimItem = async (id) => {
  const response = await claimItemAPI(id);
  return response;
};

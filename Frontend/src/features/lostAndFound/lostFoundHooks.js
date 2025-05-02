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

export const createItem = async (data) => {
  await createItemAPI(data);
};

export const updateItem = async (id, data) => {
  await updateItemAPI(id, data);
};

export const deleteItem = async (id) => {
  await deleteItemAPI(id);
};

export const addComment = async (id, text) => {
  await addCommentAPI(id, text);
};

export const claimItem = async (id) => {
  await claimItemAPI(id);
};
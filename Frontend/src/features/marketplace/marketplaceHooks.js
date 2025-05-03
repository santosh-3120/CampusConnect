import { useState, useEffect, useCallback } from 'react';
import {
  fetchItems,
  fetchItemById,
  createItem,
  updateItem,
  markItemAsSold,
  fetchUserItems,
} from './marketplaceAPI';

export const useItems = (filters) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchItems(filters);
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return { items, isLoading, error };
};

export const useItemById = (id) => {
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadItem = async () => {
      setIsLoading(true);
      try {
        const data = await fetchItemById(id);
        setItem(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadItem();
  }, [id]);

  return { item, isLoading, error };
};

export const useCreateItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await createItem(formData, token); // Pass token to API layer
      return response;
    } catch (err) {
      console.error("CreateItem Error:", err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createItem: create, isLoading, error };
};


export const useUpdateItem = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = async (id, formData) => {
    setIsLoading(true);
    try {
      await updateItem(id, formData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { updateItem: update, isLoading, error };
};

export const useMarkAsSold = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const markAsSold = async (id) => {
    setIsLoading(true);
    try {
      await markItemAsSold(id);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { markAsSold, isLoading, error };
};

export const useUserItems = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserItems = async () => {
      setIsLoading(true);
      try {
        const data = await fetchUserItems();
        setItems(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserItems();
  }, []);

  return { items, isLoading, error };
};
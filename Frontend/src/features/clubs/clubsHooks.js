import { useState, useEffect, useCallback } from 'react';
import { fetchClubs, fetchClubById, addClub, editClub, joinClub, leaveClub } from './clubsAPI';

export const useClubs = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClubs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClubs();
      setClubs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClubs();
  }, [loadClubs]);

  return { clubs, loading, error, refetch: loadClubs };
};

export const useClub = (id) => {
  const [club, setClub] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadClub = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClubById(id);
      setClub(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadClub();
  }, [id, loadClub]);

  return { club, loading, error, refetch: loadClub };
};

export const useClubActions = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createClub = async (clubData) => {
    setLoading(true);
    try {
      const response = await addClub(clubData);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateClub = async (id, clubData) => {
    setLoading(true);
    try {
      const response = await editClub(id, clubData);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const join = async (id) => {
    setLoading(true);
    try {
      const response = await joinClub(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const leave = async (id) => {
    setLoading(true);
    try {
      const response = await leaveClub(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createClub, updateClub, joinClub: join, leaveClub: leave, loading, error };
};
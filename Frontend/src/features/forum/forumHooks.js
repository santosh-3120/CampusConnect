import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { fetchQuestions, fetchQuestionById, addQuestion, deleteQuestion } from './forumAPI';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchQuestions();
      setQuestions(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return { questions, loading, error, refetch: loadQuestions };
};

export const useQuestion = (id) => {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadQuestion = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchQuestionById(id);
      setQuestion(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) loadQuestion();
  }, [id, loadQuestion]);

  return { question, loading, error, refetch: loadQuestion };
};

export const useQuestionActions = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createQuestion = async (questionData) => {
    setLoading(true);
    try {
      const response = await addQuestion({ ...questionData, user: user._id });
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeQuestion = async (id) => {
    setLoading(true);
    try {
      const response = await deleteQuestion(id);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createQuestion, deleteQuestion: removeQuestion, loading, error };
};
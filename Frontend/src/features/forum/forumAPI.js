import axios from 'axios';

export const fetchQuestions = async () => {
  const response = await axios.get('http://localhost:3000/api/forum', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const fetchQuestionById = async (id) => {
  const response = await axios.get(`http://localhost:3000/api/forum/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const addQuestion = async (questionData) => {
  const response = await axios.post('http://localhost:3000/api/forum', questionData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};

export const deleteQuestion = async (id) => {
  const response = await axios.delete(`http://localhost:3000/api/forum/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data;
};
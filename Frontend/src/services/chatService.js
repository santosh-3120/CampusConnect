import axios from 'axios';

const token = localStorage.getItem('token');

export const getChats = async () => {
  const res = await axios.get('/api/chats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getChatMessages = async (chatId) => {
  const res = await axios.get(`/api/chats/messages/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const sendMessage = async (chatId, text) => {
  const res = await axios.post(
    `/api/chats/message/${chatId}`,
    { text },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
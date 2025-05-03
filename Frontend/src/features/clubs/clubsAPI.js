import api from '../../services/api';

const clubsAPI = {
  getClubs: async () => {
    const response = await api.get('/clubs');
    return response.data;
  },

  getClub: async (id) => {
    const response = await api.get(`/clubs/${id}`);
    return response.data;
  },

  createClub: async (formData) => {
    const response = await api.post('/clubs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateClub: async (id, formData) => {
    const response = await api.put(`/clubs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteClub: async (id) => {
    await api.delete(`/clubs/${id}`);
  },

  followClub: async (id) => {
    const response = await api.post(`/clubs/${id}/follow`);
    return response.data;
  },

  unfollowClub: async (id) => {
    const response = await api.post(`/clubs/${id}/unfollow`);
    return response.data;
  },

  getMessages: async (id) => {
    const response = await api.get(`/clubs/${id}/messages`);
    return response.data;
  },

  postMessage: async (id, data, user) => {
    const response = await api.post(`/clubs/${id}/messages`, data);
    // if (user.role === 'admin') {
    //   const club = await api.get(`/api/clubs/${id}`);
    //   const followers = club.data.followers || [];
    //   if (followers.length > 0) {
    //     const followerEmails = await Promise.all(
    //       followers.map(async (userId) => {
    //         const userResponse = await api.get(`/auth/me`, {
    //           headers: { 'X-User-Id': userId },
    //         });
    //         return userResponse.data.user.email;
    //       })
    //     );
    //     await sendEmail({
    //       to: followerEmails,
    //       subject: `New Message in ${club.data.name}`,
    //       text: `A new message has been posted in ${club.data.name}: "${data.content}"`,
    //     });
    //   }
    // }
    return response.data;
  },

  deleteMessage: async (clubId, messageId) => {
    const response = await api.delete(`/clubs/${clubId}/messages/${messageId}`);
    return response.data;
  },

  getFollowers: async (id) => {
    const response = await api.get(`/clubs/${id}/followers`);
    return response.data;
  },

  removeFollower: async (clubId, userId) => {
    const response = await api.delete(`/clubs/${clubId}/followers/${userId}`);
    return response.data;
  },
};

export default clubsAPI;

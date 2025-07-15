import { useState, useCallback } from 'react';
import clubsAPI from './clubsAPI';

export function useClubs() {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchClubs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clubsAPI.getClubs();
      setClubs(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch clubs');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { clubs, isLoading, error, fetchClubs };
}

export function useClub(id) {
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchClub = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await clubsAPI.getClub(id);
      setClub(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch club');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { club, isLoading, error, fetchClub };
}

export function useCreateClub() {
  const [isCreating, setIsCreating] = useState(false);

  const createClub = useCallback(async (formData) => {
    setIsCreating(true);
    try {
      const data = await clubsAPI.createClub(formData);
      setIsCreating(false);
      return data;
    } catch (err) {
      setIsCreating(false);
      throw err;
    }
  }, []);

  return { createClub, isCreating };
}

export function useUpdateClub(id) {
  const [isUpdating, setIsUpdating] = useState(false);

  const updateClub = useCallback(async (formData) => {
    setIsUpdating(true);
    try {
      const data = await clubsAPI.updateClub(id, formData);
      setIsUpdating(false);
      return data;
    } catch (err) {
      setIsUpdating(false);
      throw err;
    }
  }, [id]);

  return { updateClub, isUpdating };
}

export function useDeleteClub(id) {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteClub = useCallback(async () => {
    setIsDeleting(true);
    try {
      await clubsAPI.deleteClub(id);
      setIsDeleting(false);
    } catch (err) {
      setIsDeleting(false);
      throw err;
    }
  }, [id]);

  return { deleteClub, isDeleting };
}

export function useClubMessages(clubId) {
  const [messages, setMessages] = useState([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState('');

  const fetchMessages = useCallback(async () => {
    setIsMessagesLoading(true);
    try {
      const data = await clubsAPI.getMessages(clubId);
      setMessages(data);
      setMessagesError('');
    } catch (err) {
      setMessagesError('Failed to fetch messages');
    } finally {
      setIsMessagesLoading(false);
    }
  }, [clubId]);

  const postMessage = useCallback(async (message, user) => {
    try {
      const data = await clubsAPI.postMessage(clubId, message, user);
      setMessages((prev) => [...prev, data]);
    } catch (err) {
      throw new Error('Failed to post message');
    }
  }, [clubId]);

  return { messages, isMessagesLoading, messagesError, fetchMessages, postMessage };
}

export function useFollowClub(id, fetchMessages) {
  const [isFollowing, setIsFollowing] = useState(false);

  const followClub = useCallback(async () => {
    setIsFollowing(true);
    try {
      await clubsAPI.followClub(id);
      setIsFollowing(false);
      fetchMessages();  // Trigger re-fetch of messages after following the club
    } catch (err) {
      setIsFollowing(false);
      throw err;
    }
  }, [id, fetchMessages]);

  return { followClub, isFollowing };
}

export function useUnfollowClub(id, fetchMessages) {
  const [isUnfollowing, setIsUnfollowing] = useState(false);

  const unfollowClub = useCallback(async () => {
    setIsUnfollowing(true);
    try {
      await clubsAPI.unfollowClub(id);
      setIsUnfollowing(false);
      fetchMessages();  // Trigger re-fetch of messages after unfollowing the club
    } catch (err) {
      setIsUnfollowing(false);
      throw err;
    }
  }, [id, fetchMessages]);

  return { unfollowClub, isUnfollowing };
}


export function useDeleteMessage() {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteMessage = useCallback(async (clubId, messageId) => {
    if (!clubId || !messageId) throw new Error("Missing clubId or messageId");
    setIsDeleting(true);
    try {
      await clubsAPI.deleteMessage(clubId, messageId);
    } catch (err) {
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return { deleteMessage, isDeleting };
}

export function useFollowers(clubId) {
  const [followers, setFollowers] = useState([]);
  const [isFollowersLoading, setIsFollowersLoading] = useState(false);
  const [followersError, setFollowersError] = useState('');

  const fetchFollowers = useCallback(async () => {
    setIsFollowersLoading(true);
    try {
      const data = await clubsAPI.getFollowers(clubId);
      setFollowers(data);
      setFollowersError('');
    } catch (err) {
      setFollowersError('Failed to fetch followers');
    } finally {
      setIsFollowersLoading(false);
    }
  }, [clubId]);

  return { followers, isFollowersLoading, followersError, fetchFollowers };
}

export function useRemoveFollower(clubId) {
  const [isRemoving, setIsRemoving] = useState(false);

  const removeFollower = useCallback(async (userId) => {
    setIsRemoving(true);
    try {
      await clubsAPI.removeFollower(clubId, userId);
      setIsRemoving(false);
    } catch (err) {
      setIsRemoving(false);
      throw err;
    }
  }, [clubId]);

  return { removeFollower, isRemoving };
}

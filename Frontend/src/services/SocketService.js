// src/services/SocketService.js
import io from 'socket.io-client';

class SocketService {
  socket = null;

  connect(token) {
    if (!this.socket) {
      // Use backend service name for Docker; fallback to localhost for development
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://backend:3000';
      this.socket = io(socketUrl, {
        auth: { token },
        transports: ['websocket', 'polling'], // Prefer WebSocket, fallback to polling
        path: '/socket.io', // Explicitly set path to match backend
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event, callback) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }
}

export default new SocketService();
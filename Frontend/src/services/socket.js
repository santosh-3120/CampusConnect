import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL, {
  autoConnect: false,
});

export function connectSocket() {
  socket.connect();
}

export function disconnectSocket() {
  socket.disconnect();
}

export default socket;
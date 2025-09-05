// config/socket.js
const socketIo = require('socket.io');

let io;

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://frontend:80', // Use frontend service name in Docker
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinChat', (chatId) => {
      socket.join(chatId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = { initSocket, getIO };
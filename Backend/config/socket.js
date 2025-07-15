const socketIo = require('socket.io');

let io;

function initSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true, // ✅ ADD THIS LINE
    },
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
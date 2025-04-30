const emitNewLostFoundPost = (post) => {
    const io = require('../config/socket').getIO();
    io.emit('newLostFoundPost', post);
  };
  
  const emitNotification = (notification) => {
    const io = require('../config/socket').getIO();
    io.emit('notification', notification);
  };
  
  const emitNewMessage = (chat) => {
    const io = require('../config/socket').getIO();
    const latestMessage = chat.messages[chat.messages.length - 1];
    io.to(chat._id.toString()).emit('newMessage', latestMessage);
  };
  
  module.exports = { emitNewLostFoundPost, emitNotification, emitNewMessage };
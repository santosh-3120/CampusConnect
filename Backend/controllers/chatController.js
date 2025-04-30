const Chat = require('../models/Chat');
const { emitNewMessage } = require('../utils/socketHandler');

const initiateChat = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;
    
    let chat = await Chat.findOne({
      relatedItem: itemId,
      participants: { $all: [userId, req.body.posterId] },
    });
    
    if (!chat) {
      chat = new Chat({
        relatedItem: itemId,
        participants: [userId, req.body.posterId],
        messages: [],
      });
      await chat.save();
    }
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    
    const chat = await Chat.findById(chatId);
    
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    
    const message = {
      sender: req.user._id,
      text,
      createdAt: new Date(),
    };
    
    chat.messages.push(message);
    await chat.save();
    
    const populatedChat = await Chat.findById(chatId)
      .populate('participants', 'name rollNo')
      .populate('messages.sender', 'name');
    
    emitNewMessage(populatedChat);
    
    res.status(201).json(populatedChat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findById(chatId)
      .populate('participants', 'name rollNo')
      .populate('messages.sender', 'name');
    
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { initiateChat, sendMessage, getChat };
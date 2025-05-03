const Chat = require('../models/Chat');
const User = require('../models/User');

exports.initiateChat = async (req, res) => {
  try {
    const { recipientId } = req.params;

    if (req.user._id.toString() === recipientId) {
      return res.status(400).json({ message: 'Cannot chat with yourself' });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: 'Recipient not found' });

    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, recipientId], $size: 2 },
    });

    if (!chat) {
      chat = new Chat({
        participants: [req.user._id, recipientId],
        messages: [],
      });
      await chat.save();
      await chat.populate('participants', 'name rollNo');
    }

    const io = req.app.get('io');
    io.to(req.user._id.toString()).emit('newChat', {
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages,
      lastMessage: chat.lastMessage,
    });
    io.to(recipientId).emit('newChat', {
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages,
      lastMessage: chat.lastMessage,
    });

    res.status(200).json({
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages,
      lastMessage: chat.lastMessage,
    });
  } catch (error) {
    console.error('Initiate chat error:', error);
    res.status(500).json({ message: 'Error initiating chat', error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const isParticipant = chat.participants.some(p =>
      p.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    const message = {
      sender: req.user._id,
      text: text.trim(),
      createdAt: new Date(),
    };
    chat.messages.push(message);
    chat.lastMessage = new Date();
    await chat.save();

    const io = req.app.get('io');
    chat.participants.forEach(participant => {
      io.to(participant.toString()).emit('newMessage', {
        chatId,
        message: {
          sender: { _id: req.user._id, name: req.user.name },
          text: text.trim(),
          createdAt: message.createdAt,
        },
      });
    });

    res.status(201).json({
      chatId,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.user._id })
      .populate('participants', 'name rollNo')
      .sort({ lastMessage: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ message: 'Error fetching chats', error: error.message });
  }
};

exports.getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate('participants', 'name rollNo');
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const isParticipant = chat.participants.some(p =>
      p._id.toString() === req.user._id.toString()
    );
    if (!isParticipant) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    res.status(200).json({
      _id: chat._id,
      participants: chat.participants,
      messages: chat.messages,
      lastMessage: chat.lastMessage,
    });
  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

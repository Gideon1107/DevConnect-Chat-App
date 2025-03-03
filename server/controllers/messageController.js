import Message from '../models/Message.js';

// Send a Message (User-to-User, Group, or Channel)
export const sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, groupId, content, type } = req.body;

    if (!senderId || !content) {
      return res.status(400).json({ message: 'Sender and content are required' });
    }

    // Ensure only one of receiverId, groupId, or channelId is provided
    const targetIds = [receiverId, groupId].filter(id => id);
    if (targetIds.length !== 1) {
      return res.status(400).json({ message: 'A message must be sent to either a user, group, or channel, not multiple' });
    }

    const newMessage = new Message({ senderId, receiverId, groupId, content, type });
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully', newMessage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Messages (User-to-User or  Group)
export const getMessages = async (req, res) => {
  try {
    const { type, id } = req.params; // type = 'user', 'group'

    let messages;
    if (type === 'user') {
      messages = await Message.find({
        $or: [{ senderId: id }, { receiverId: id }],
      })
        .populate('senderId', 'username profilePicture')
        .populate('receiverId', 'username profilePicture');
    } else if (type === 'group') {
      messages = await Message.find({ groupId: id })
        .populate('senderId', 'username profilePicture');
    } else {
      return res.status(400).json({ message: 'Invalid message type' });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

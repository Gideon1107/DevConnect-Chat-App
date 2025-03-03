import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who sent the message
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For direct messages, can be null
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },  // For group messages, can be null
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' }, // Message type: text, image, file
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },  // Whether the message has been read
});

export default mongoose.model('Message', messageSchema);

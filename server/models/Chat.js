import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    type: { type: String, enum: ['individual', 'group'], required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' }, // Reference to Group for group chats
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Chat', chatSchema);
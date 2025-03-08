import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '', trim: true }, // Group description
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // List of user IDs who are members
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User who created the group
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },  // Track updates to the group
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);

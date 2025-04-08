import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, default: '', trim: true }, // Group description
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }],  // List of user IDs who are members
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true }, // User who created the group
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Messages', required: false }], // List of message IDs
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

groupSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

groupSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.model('Groups', groupSchema);

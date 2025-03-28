import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  profilePicture: { type: String }, // No default value here
  status: { type: String, enum: ['online', 'offline', 'away', 'busy'], default: 'offline' },
  lastSeenActive: { type: Date, default: Date.now },
  joinedGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  googleId: { type: String, unique:true, sparse: true } // Added googleId field
}, { timestamps: true });

// Middleware to set default profile picture before saving
userSchema.pre('save', function (next) {
  if (!this.profilePicture) {
    const sanitizedUsername = this.username.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase
    this.profilePicture = `https://ui-avatars.com/api/?name=${sanitizedUsername}&background=random`;
  }
  next();
});

export default mongoose.model('Users', userSchema);


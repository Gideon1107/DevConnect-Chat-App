import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    messageType: {type: String, enum: ["text", "file"], required: true},
    content: { type: String, required : function () {
        return this.messageType === "text";
    } },
    mediaUrl: { type: String, required : function () {
        return this.messageType === "file";
    } },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false }],
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Messages', messageSchema);

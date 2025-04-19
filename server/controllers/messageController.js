import Message from '../models/Message.js';


// Get Messages 
export const getMessages = async (req, res) => {
  try {
    const user1  = req.user.id;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return response.status(400).json({ success: false, message: "Both user IDs are required."})
    }

    const messages = await Message.find({
      $or: [
        {sender: user1, recipient: user2},
        {sender: user2, recipient: user1},
      ],
      // deletedFor: { $ne: user1 }  // Don't include messages marked as deleted for this user
    }).sort({timestamp: 1});

    return res.status(200).json({messages});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Send File Message
export const sendFileMessage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).json({success: false, message: 'No file uploaded' });
    }

    res.status(200).json({
      success: true,
      fileUrl: req.file.location, // S3 file URL
    });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      console.error('Multer error:', error);
      return res.status(200).json({ success: false, message: error.message });
    }
    res.status(200).json({ success: false, message: 'Server error', error: error.message });
  }
}

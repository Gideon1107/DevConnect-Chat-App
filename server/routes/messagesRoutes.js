import express from 'express';
import { getMessages } from '../controllers/messageController.js';
import authUser  from '../middlewares/authMiddleware.js'; 
import messageFileUpload from '../middlewares/messageFileUpload.js';
import { sendFileMessage } from '../controllers/messageController.js'; // Import the sendFileMessage function
import multer from 'multer'; // Import multer for file handling


const router = express.Router();


// Get messages
router.post('/get-messages', authUser, getMessages); // Protect the route with authUser

// Send file message
router.post('/upload-file', authUser, (req, res, next) => {
    messageFileUpload.single("file")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(200).json({ success: false, message: err.message });
      } else if (err) {
        return res.status(200).json({ success: false, message: "Upload failed", error: err.message });
      }
      next();
    });
  }, sendFileMessage);



export default router;


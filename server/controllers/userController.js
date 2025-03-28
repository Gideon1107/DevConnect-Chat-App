import User from '../models/User.js';
import bcrypt from 'bcrypt'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';



// Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Get the authenticated user ID from middleware
        const user = await User.findById(userId).select('-password');   //excluding password from being retrieved
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// Get All User Profile
export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find({
            $and: [{ _id: { $ne: req.user.id}}],
        })
        res.status(200).json(allUsers);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



// Update User Profile 
export const updateUserProfile = async (req, res) => {
    try {
        const { username } = req.body;

        const userId = req.user.id; // Get authenticated user ID from middleware
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const usernameExists = await User.findOne({ username })
        
        if (usernameExists) {
            if (usernameExists.id !== userId) {
                return res.status(200).json({ success: false, message: "Username already exists" })
            }
        }

        const usernamePattern = /^[a-zA-Z0-9_-]+$/;  // Only allows alphanumeric characters, underscores, and hyphens

        if (!usernamePattern.test(username)) {
            return res.status(400).json({ message: 'Username cannot contain spaces or special characters.' });
        }
        
        // Update username fields if provided
        user.username = username || user.username;
        await user.save();
        res.status(200).json({ success: true, message: 'Profile updated', user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id //Getting user id from middleware
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if a file was uploaded and store the S3 URL
        if (req.file) {
            user.profilePicture = req.file.location; // S3 file URL
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Profile picture updated', user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}


export const deleteProfilePicture = async (req, res) => {

    // Initialize S3 client
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    });


    try {

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' })

        // Extract file key correctly
        const fileKey = user.profilePicture.split(`${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];

        if (fileKey) {
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
            }

            await s3.send(new DeleteObjectCommand(deleteParams));
        }

        const sanitizedUsername = user.username.replace(/\s+/g, '-').toLowerCase(); // Replace spaces with hyphens and convert to lowercase so link dont break
        user.profilePicture = `https://ui-avatars.com/api/?name=${sanitizedUsername}&background=random`;

        await user.save();
        res.status(200).json({ success: true, message: 'Profile picture deleted', user });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}



// Change User Password
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword  } = req.body;
        

        //Check if the newpassord is same with confirm password
        if (newPassword !== confirmPassword) {
            return res.status(200).json({ success: false, message: "Passowrd must match"});
        }

        // Validate the input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Both current and new passwords are required' });
        }

        // Find the user in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Compare the provided current password with the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(200).json({ success: false, message: 'Incorrect current password' });
        }

        // Check if the new password is the same as the current one
        if (currentPassword === newPassword) {
            return res.status(200).json({ success: false, message: 'New password must be different from the current password' });
        }

        // Hash the new password and save it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated successfully', user });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};



// Allow User to delete profile
export const deleteUser = async (req, res) => {
    try {

        // Ensure the user can only delete their own account
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this user' });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If the user is found, delete it
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from "validator";
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const createAuthToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '2h', // Access token expires in 2 hours
    });
};

const createRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Refresh token expires in 30 days
    });
};


// Register a new user
export const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // checking if user already exist
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.status(200).json({ success: false, message: "User already exists" })
        }

        // Checking if email is valid
        if (!validator.isEmail(email)) {
            return res.status(200).json({ success: false, message: "Please enter a valid email" })
        }

        // Checking password length
        if (password.length < 8) {
            return res.status(200).json({ success: false, message: "Please enter a longer password" })
        }

        // Check if username is already being used by another user
        const usernameExists = await User.findOne({ username })

        if (usernameExists) {
            return res.status(200).json({ success: false, message: "Username already exists" })
        }

        // check if username is provided
        if (!username.trim()) {
            return res.status(400).json({ success: false, message: 'Username is required' });
        }

        const usernamePattern = /^[a-zA-Z0-9_-]+$/;  // Only allows alphanumeric characters, underscores, and hyphens

        // Check if username contains special characters
        if (!usernamePattern.test(username)) {
            return res.status(400).json({ message: 'Username cannot contain spaces or special characters.' });
        }

        //Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user
        const user = new User({ username, email, password: hashedPassword, googleId: undefined });
        user.status = "online";
        await user.save();

        // Generate Token
        const authToken = createAuthToken(user._id)
        const refreshToken = createRefreshToken(user._id);

        // Return tokens in response body for localStorage storage on client
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            authToken,
            refreshToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }

};



//Route for user login
export const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email })

        if (!user) {
            return res.status(200).json({ success: false, message: "User does not exists" })
        }

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {

            user.status = "online"; // Set user status to online
            await user.save();

            // Generate Token
            const authToken = createAuthToken(user._id)
            const refreshToken = createRefreshToken(user._id);

            // Return tokens in response body for localStorage storage on client
            res.status(200).json({
                success: true,
                message: 'User logged in successfully',
                authToken,
                refreshToken,
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profilePicture: user.profilePicture
                }
            });

        } else {
            res.status(200).json({ success: false, message: 'Incorrect password' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Error logging in user', error: error.message });
    }
}

// Route for Login in with Google
export const googleLogin = async (req, res) => {
    try {
        const userId =  req.user.id
        const user = await User.findById(userId)
        user.status = "online"; // Set user status to online
        await user.save();
        
        // Successful authentication, generate a JWT token
        const authToken = createAuthToken(userId)
        const refreshToken = createRefreshToken(userId);

        // For Google OAuth, we need to pass tokens to the client
        // Since we can't directly access localStorage from the server,
        // we'll redirect to a special route that will handle token storage

        // Redirect with tokens as URL parameters (will be handled by client)
        res.redirect(`${process.env.ORIGIN}/auth-callback?authToken=${authToken}&refreshToken=${refreshToken}`);
    } catch (error) {
        res.status(400).json({ message: 'Error logging in user', error: error.message });
    }
}


// Logout User Route
export const logoutUser = async (req, res) => {
    const { id } = req.user // Get user id from middleware

    const user = await User.findById(id); // Find the user in the database

    user.status = "offline"; // Set user status to offline
    user.lastSeenActive = Date.now(); // Set the last seen active time to the current time
    await user.save();

    // With localStorage approach, tokens are cleared on the client side
    // No need to clear cookies on the server

    // Send a response indicating successful logout
    res.status(200).json({ success: true, message: 'User logged out successfully' });
};



// Route for Admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = createToken(email + password);
            res.json({ success: true, message: "Admin sucessfully logged in", token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "If a user with this email exists, you will receive a password reset email." 
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        // Save hashed version of token
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.ORIGIN}/reset-password/${resetToken}`;

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset Request</h1>
                <p>You requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "If a user with this email exists, you will receive a password reset email."
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error processing password reset request" 
        });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Password reset token is invalid or has expired"
            });
        }

        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        // Generate new tokens
        const authToken = createAuthToken(user._id);
        const refreshToken = createRefreshToken(user._id);

        res.status(200).json({
            success: true,
            message: "Password has been reset successfully",
            authToken,
            refreshToken,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture
            }
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: "Error resetting password"
        });
    }
};

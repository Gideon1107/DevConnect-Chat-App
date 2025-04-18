import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from "validator";


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


        // Store the refresh token in an httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiration
        });


        // Store the auth token in an httpOnly cookie
        res.cookie('authToken', authToken, {
            httpOnly: true,  
            secure: true,  
            sameSite: 'None',  
            maxAge: 2 * 60 * 60 * 1000,  // 2 hour expiration
        });

        res.status(201).json({ success: true, message: 'User registered successfully', authToken });

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

            // Store the refresh token in an httpOnly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true, 
                sameSite: 'None', 
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiration
            });


            // Store the auth token in an httpOnly cookie
            res.cookie('authToken', authToken, {
                httpOnly: true, 
                secure: true,  
                sameSite: 'None', 
                maxAge: 2 * 60 * 60 * 1000,  // 2 hour expiration
            });

            res.status(200).json({ success: true, message: 'User logged in successfully', authToken });

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
        // Successful authentication, generate a JWT token

        const authToken = createAuthToken(req.user.id)
        const refreshToken = createRefreshToken(req.user.id);

        // Store the refresh token in an httpOnly cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'None', 
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days expiration
        });


        // Store the auth token in an httpOnly cookie
        res.cookie('authToken', authToken, {
            httpOnly: true,  // Prevents access to cookie via JavaScript (XSS protection)
            secure: true,  
            sameSite: 'None',  
            maxAge: 2 * 60 * 60 * 1000,  // 2 hour expiration
        });


        // Redirect the user to /chat
        res.redirect(`${process.env.ORIGIN}/chat`);
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


    // Clear the tokens from the cookie
    res.clearCookie('authToken', {
        httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
        secure: true, // Set to true only in production
        sameSite: 'None', // Helps prevent CSRF attacks
    });

    res.clearCookie('refreshToken', {
        httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
        secure: true, 
        sameSite: 'None',
    });

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

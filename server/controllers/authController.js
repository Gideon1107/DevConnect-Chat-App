import User from '../models/User.js';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import validator from "validator";


const createToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '2h', //Token expires in 1 hour
    })
};


// Register a new user
export const registerUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        // checking if user already exist
        const emailExists = await User.findOne({ email })
        if (emailExists) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        // Checking if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" })
        }

        // Checking password length
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a longer password" })
        }

        // Check if username is already being used by another user
        const usernameExists = await User.findOne({ username })

        if (usernameExists) {
            return res.status(409).json({ success: false, message: "Username already exists" })
        }

        //Hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // create user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Create Token
        const token = createToken(user._id)
        res.status(201).json({ success: true, message: 'User registered successfully', token });

    } catch (error) {
        res.status(400).json({ message: 'Error registering user', error: error.message });
    }

};



//Route for user login
export const loginUser = async (req, res) => {

    try {
        const {email, password} = req.body;

        // Find user by email
        const user = await User.findOne({email})

        if (!user) {
            return res.status(409).json({ success: false, message: "User does not exists" })
        }

        // Check if the password is correct
         const isPasswordValid = await bcrypt.compare(password, user.password);

         if (isPasswordValid) {
            const token = createToken(user._id)
            res.status(201).json({ success: true, message: 'User logged in successfully', token });
         } else {
            res.status(400).json({ success: false, message: 'Incorrect password'});
         }
    } catch (error) {
        res.status(400).json({ message: 'Error logging in user', error: error.message });
    }
}


// Logout User (Frontend should remove token)
export const logoutUser = async (req, res) => {
    res.status(200).json({ success: true, message: 'User logged out successfully' });
  };
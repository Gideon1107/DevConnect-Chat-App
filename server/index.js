import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import passport from 'passport';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import messagesRoutes from './routes/messagesRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import groupRoutes from './routes/groupRoutes.js'
import connectDB from './config/mongodb.js';
import cookieParser from 'cookie-parser';

import './config/passportConfig.js'; // Import passport configuration
import setupSocket from './socket.js';


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.ORIGIN ,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Disposition', 'Content-Type'],
}));

// Add these headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  next();
});

app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.set('trust proxy', 1)


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/group', groupRoutes)


app.get("/", (req, res) => {
  res.send("API Working")
})

// Connect to MongoDB
connectDB();

//Connect Socket io
setupSocket(server)

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


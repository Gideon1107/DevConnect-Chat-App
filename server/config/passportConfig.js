import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ 
        $or: [
          { googleId: profile.id }, 
          { email: profile.emails[0].value }
        ] 
      });

      if (!user) {
        let baseUsername = profile.displayName.split(' ')[0].toLowerCase(); // Extract first name & lowercase
        let username = baseUsername;
        // Check if username exists
        let existingUser = await User.findOne({ username });
        let count = 1;

        while (existingUser) {
          username = `${baseUsername}${count}`; // Append a number
          existingUser = await User.findOne({ username });
          count++;
        }

        user = new User({
          googleId: profile.id,
          username,
          password: "googleUser",
          status: "online",
          email: profile.emails[0].value,
          profilePicture: `https://ui-avatars.com/api/?name=${username}&background=random`
        });

        await user.save();
        
      } else {
        // If user exists but doesn't have googleId, update it
        if (!user.googleId) {
          user.googleId = profile.id;
        }
        
        user.status = "online"; // Set user status to online
        await user.save();
      }

      done(null, user);
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        done(new Error('Email already registered with different account'));
      } else {
        done(new Error('Error during authentication: ' + error.message));
      }
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
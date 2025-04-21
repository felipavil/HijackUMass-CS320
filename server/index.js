// server/index.js
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import cors from 'cors';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import postsRouter from './routes/posts.js';

dotenv.config();

const app = express();
const PORT = 3000; // Backend port

// Enable CORS for React frontend
app.use(cors({
  origin: 'http://localhost:5173', // React frontend URL
  credentials: true,
}));

// Express session
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport config
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    const email = profile.emails[0].value;
    if(true){ //swap this with the next line to ACTUALLY verify umass email
    //if (email.endsWith('@umass.edu')) { 
      return done(null, profile);
    } else {
      return done(null, false, { message: 'Only UMass Amherst emails allowed' });
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/fail-log-in' }),
  (req, res) => {
    res.redirect('http://localhost:5173'); // Redirect to your React home
  }
);

// API to check if user is authenticated
app.get('/api/authenticated', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ authenticated: true, user: req.user });
  } else {
    res.json({ authenticated: false });
  }
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173');
  });
});

app.get('/fail-log-in', (req, res)=>{
  res.redirect("http://localhost:5173/fail-log-in")
})

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

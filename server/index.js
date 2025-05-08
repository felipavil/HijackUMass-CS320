const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./authMiddleware');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// PostgreSQL pool setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Google OAuth2 setup
const googleClient = new OAuth2Client();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/ping', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW()');
    res.json({ msg: 'pong', time: dbRes.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!email.endsWith('@umass.edu')) {
    return res.status(400).json({ error: 'Only @umass.edu emails allowed' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashed]
    );

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'Email already registered' });
    } else {
      res.status(500).json({ error: 'Signup failed' });
    }
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Google login route
app.post('/api/google-login', async (req, res) => {
  const { id_token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email.endsWith('@umass.edu')) {
      return res.status(403).json({ error: 'Only @umass.edu emails allowed' });
    }

    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user;

    if (existing.rows.length > 0) {
      user = existing.rows[0];
    } else {
      const insert = await pool.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
        [name, email, 'google-oauth']
      );
      user = insert.rows[0];
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });

  } catch (err) {
    console.error('Google Login Error:', err);
    res.status(401).json({ error: 'Invalid Google token' });
  }
});

// Routes
const postsRoutes = require('./routes/posts');
app.use(postsRoutes);

const messageRoutes = require('./routes/messages');
app.use('/api/messages', messageRoutes);

const confirmRoutes = require('./routes/confirm');
app.use('/api/confirm', confirmRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');
const rateLimit = require('express-rate-limit');

// Rate limiter: max 5 posts per user every 5 minutes
const postLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,
  message: { error: 'Too many posts. Please wait and try again later.' },
  keyGenerator: (req) => req.user.id,
  standardHeaders: true,
  legacyHeaders: false,
});

// CREATE a new post
router.post('/api/posts', authenticateToken, postLimiter, async (req, res) => {
  const { role, from, to, date, seats } = req.body;
  const userId = req.user.id;

  // Input validation
  if (!role || !from || !to || !date || !seats) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (!['driver', 'rider'].includes(role)) {
    return res.status(400).json({ error: 'Role must be driver or rider' });
  }

  if (isNaN(seats) || seats <= 0) {
    return res.status(400).json({ error: 'Seats must be a positive number' });
  }

  const today = new Date().toISOString().split('T')[0];
  if (date < today) {
    return res.status(400).json({ error: 'Date cannot be in the past' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (user_id, role, from_location, to_location, ride_date, seats)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [userId, role, from, to, date, seats]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// READ all posts with user info
router.get('/api/posts', authenticateToken, async (req, res) => {
  const { role, from, to, date, seats } = req.query;

  let query = `SELECT posts.*, users.id AS user_id, users.name, users.email
             FROM posts
             JOIN users ON posts.user_id = users.id
             WHERE 1=1`;
  const values = [];
  let i = 1;

  if (role) {
    query += ` AND role = $${i++}`;
    values.push(role);
  }
  if (from) {
    query += ` AND from_location ILIKE $${i++}`;
    values.push(`%${from}%`);
  }
  if (to) {
    query += ` AND to_location ILIKE $${i++}`;
    values.push(`%${to}%`);
  }
  if (date) {
    query += ` AND ride_date = $${i++}`;
    values.push(date);
  }
  if (seats) {
    query += ` AND seats >= $${i++}`;
    values.push(seats);
  }
  if (req.query.is_matched === 'false') {
    query += ` AND is_matched = false`;
  }
  query += ' ORDER BY ride_date ASC';

  try {
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching filtered posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// DELETE a post (only by the owner)
router.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      'DELETE FROM posts WHERE post_id = $1 AND user_id = $2 RETURNING *',
      [postId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Unauthorized or post not found' });
    }

    res.json({ message: 'Post deleted successfully', post: result.rows[0] });
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// UPDATE a post (only by the owner)
router.put('/:id', authenticateToken, async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const { from_location, to_location, ride_date, seats } = req.body;

  // Input validation
  if (!from_location || !to_location || !ride_date || !seats) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(seats) || seats <= 0) {
    return res.status(400).json({ error: 'Seats must be a positive number' });
  }

  const today = new Date().toISOString().split('T')[0];
  if (ride_date < today) {
    return res.status(400).json({ error: 'Date cannot be in the past' });
  }

  try {
    const result = await pool.query(
      `UPDATE posts
       SET from_location = $1,
           to_location = $2,
           ride_date = $3,
           seats = $4
       WHERE post_id = $5 AND user_id = $6
       RETURNING *`,
      [from_location, to_location, ride_date, seats, postId, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ message: 'Unauthorized or post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

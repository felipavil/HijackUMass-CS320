const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

// GET /api/confirm/:postId → see who has confirmed
router.get('/:postId', authenticateToken, async (req, res) => {
  const postId = req.params.postId;

  try {
    const result = await pool.query('SELECT * FROM confirmed_rides WHERE post_id = $1', [postId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No confirmation record found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Failed to fetch confirmation:', err);
    res.status(500).json({ error: 'Error fetching confirmation' });
  }
});

// POST /api/confirm/:postId → confirm ride
router.post('/:postId', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const result = await pool.query('SELECT * FROM confirmed_rides WHERE post_id = $1', [postId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Ride not found' });

    const { rider_id, driver_id } = result.rows[0];
    if (userId !== rider_id && userId !== driver_id) {
      return res.status(403).json({ error: 'Not your ride' });
    }

    const field = userId === rider_id ? 'rider_confirmed' : 'driver_confirmed';

    await pool.query(
      `UPDATE confirmed_rides SET ${field} = TRUE WHERE post_id = $1`,
      [postId]
    );

    res.json({ message: `${field} set to true` });
  } catch (err) {
    console.error('Confirm ride failed:', err);
    res.status(500).json({ error: 'Could not confirm ride' });
  }
});

// POST /api/confirm/:postId/demo → instant match for demo purposes
router.post('/:postId/demo', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const postRes = await pool.query('SELECT * FROM posts WHERE post_id = $1', [postId]);
    if (postRes.rows.length === 0) return res.status(404).json({ error: 'Post not found' });

    const driverId = postRes.rows[0].user_id;
    const riderId = userId;

    if (driverId === riderId) {
      return res.status(400).json({ error: 'Cannot match your own post' });
    }

    await pool.query(`
      INSERT INTO confirmed_rides (post_id, driver_id, rider_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (post_id) DO NOTHING
    `, [postId, driverId, riderId]);

    await pool.query('UPDATE posts SET is_matched = true WHERE post_id = $1', [postId]);

    res.json({ message: 'Demo match successful' });
  } catch (err) {
    console.error('Demo match error:', err);
    res.status(500).json({ error: 'Failed to demo match' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

// POST /api/reviews → submit a review
router.post('/', authenticateToken, async (req, res) => {
  const { post_id, stars, comment } = req.body;
  const reviewer_id = req.user.id;

  if (!post_id || !stars || stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    // Check that user was the rider, and confirmed the ride
    // DEMO MODE: Skip rider confirmation check
  const rideCheck = await pool.query(`
    SELECT * FROM confirmed_rides
    WHERE post_id = $1 AND rider_id = $2
  `, [post_id, reviewer_id]);

  if (rideCheck.rows.length === 0) {
    return res.status(403).json({ error: 'You are not authorized to review this ride' });
  }

    const target_id = rideCheck.rows[0].driver_id;

    await pool.query(`
      INSERT INTO reviews (post_id, reviewer_id, target_id, stars, comment)
      VALUES ($1, $2, $3, $4, $5)
    `, [post_id, reviewer_id, target_id, stars, comment]);

    res.status(201).json({ message: 'Review submitted' });
  } catch (err) {
    console.error('Review submission failed:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'You already reviewed this ride' });
    } else {
      res.status(500).json({ error: 'Failed to submit review' });
    }
  }
});

// GET /api/reviews/:userId → all reviews for a driver
router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(`
      SELECT stars, comment, r.created_at, u.name AS reviewer_name
      FROM reviews r
      JOIN users u ON r.reviewer_id = u.id
      WHERE target_id = $1
      ORDER BY created_at DESC
    `, [userId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to fetch reviews:', err);
    res.status(500).json({ error: 'Failed to get reviews' });
  }
});

// GET /api/reviews/exists/:postId → check if current user has already reviewed
router.get('/exists/:postId', authenticateToken, async (req, res) => {
  const postId = req.params.postId;
  const userId = req.user.id;

  try {
    const result = await pool.query(`
      SELECT * FROM reviews
      WHERE post_id = $1 AND reviewer_id = $2
    `, [postId, userId]);

    res.json({ alreadyReviewed: result.rows.length > 0 });
  } catch (err) {
    console.error('Check review existence failed:', err);
    res.status(500).json({ error: 'Error checking review status' });
  }
});

// GET /api/reviews/avg/:userId → average rating for a driver
router.get('/avg/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const result = await pool.query(
        `SELECT ROUND(AVG(stars), 1) AS avg_rating, COUNT(*) AS total
         FROM reviews
         WHERE target_id = $1`,
        [userId]
      );
  
      res.json(result.rows[0]); // { avg_rating: 4.7, total: 12 }
    } catch (err) {
      console.error('Failed to fetch avg rating:', err);
      res.status(500).json({ error: 'Error fetching average rating' });
    }
  });
  

module.exports = router;

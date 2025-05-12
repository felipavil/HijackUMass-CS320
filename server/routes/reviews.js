import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Create review for a user
router.post('/:userId/review', async (req, res) => {
  const { userId } = req.params;
  const { reviewer_id, rating, comment } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, reviewer_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, reviewer_id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Fetch reviews for a specific user
router.get('/:userId/reviews', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;

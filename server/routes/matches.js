import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// fetch matches for a driver
router.get('/driver/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM matches 
       WHERE driver_post_id IN (
         SELECT post_id FROM posts WHERE user_id = $1 AND is_rider_post = FALSE
       )`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch driver matches' });
  }
});

// fetch matches for a rider
router.get('/rider/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM matches 
       WHERE rider_post_id IN (
         SELECT post_id FROM posts WHERE user_id = $1 AND is_rider_post = TRUE
       )`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch rider matches' });
  }
});

export default router;
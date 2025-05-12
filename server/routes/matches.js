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

// assigning payment method (cash or app) to a rider in a match
router.put('/:match_id/payment', async (req, res) => {
    const { match_id } = req.params;
    const { payment_method } = req.body;
  
    if (!['cash', 'app'].includes(payment_method)) {
      return res.status(400).json({ error: 'Invalid payment method. Use "cash" or "app".' });
    }
  
    try {
      const result = await pool.query(
        'UPDATE matches SET payment_method = $1 WHERE match_id = $2 RETURNING *',
        [payment_method, match_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Match not found' });
      }
  
      res.json({ message: 'Payment method updated successfully', match: result.rows[0] });
    } catch (err) {
      console.error('Error updating payment method:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

export default router;
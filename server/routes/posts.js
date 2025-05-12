import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Create post
router.post('/', async (req, res) => {
  const {
    user_id, place_from, place_to,
    time_from, time_to,
    is_rider_post, available_seats, seats_needed
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO posts (
        user_id, place_from, place_to, time_from, time_to,
        is_rider_post, available_seats, seats_needed
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        user_id,
        place_from,
        place_to,
        time_from,  // NEED TO CHANGE TO TIMESTAMP FORMAT
        time_to,    // DITTO
        is_rider_post,
        available_seats,
        seats_needed
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Post creation error:", err.message, err.stack); 
    res.status(500).json({ error: err.message }); 
  }  
});


// Get all posts, or filter by rider/driver posts
router.get('/', async (req, res) => {
    const { is_rider_post } = req.query;
  
    let query = 'SELECT * FROM posts';
    const values = [];
  
    if (is_rider_post !== undefined) {
      const isRiderBool = is_rider_post === 'true';
      query += ' WHERE is_rider_post = $1';
      values.push(isRiderBool);
    }
  
    query += ' ORDER BY created_at DESC';
  
    try {
      const result = await pool.query(query, values);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  });
  
// Get post by ID
router.get('/:id', async (req, res) => {
    const postId = req.params.id;
  
    try {
      const result = await pool.query('SELECT * FROM posts WHERE post_id = $1', [postId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  });

export default router;
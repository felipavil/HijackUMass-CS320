import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Create user
router.post('/', async (req, res) => {
  const { name, email, phone, role, avatar } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, role, avatar)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, email, phone, role, avatar]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get all users
router.get('/', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

// Get user by ID
router.get('/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role = 'driver' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Get specific driver by ID
router.get('/drivers/:id', async (req, res) => {
  const driverId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1 AND role = 'driver'`,
      [driverId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch driver profile' });
  }
});
   
// Get all riders
router.get('/riders', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE role = 'rider' ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch riders' });
  }
});

// Get specific rider by ID
router.get('/riders/:id', async (req, res) => {
  const riderId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE user_id = $1 AND role = 'rider'`,
      [riderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Rider not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rider profile' });
  }
});


export default router;
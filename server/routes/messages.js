const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../authMiddleware');

// GET /api/messages/inbox - show conversations involving the current user
router.get('/inbox', authenticateToken, async (req, res) => {
    const userEmail = req.user.email;
  
    try {
      const result = await pool.query(
        `
        SELECT DISTINCT ON (post_id, other_email)
          m.post_id,
          u.name,
          m2.other_email AS email,
          m.message AS last_message,
          m.timestamp AS last_time
        FROM messages m
        JOIN (
          SELECT *,
            CASE
              WHEN sender_email = $1 THEN recipient_email
              ELSE sender_email
            END AS other_email
          FROM messages
          WHERE sender_email = $1 OR recipient_email = $1
        ) m2 ON m.post_id = m2.post_id AND (
             m.sender_email = m2.sender_email AND m.recipient_email = m2.recipient_email
          OR m.sender_email = m2.recipient_email AND m.recipient_email = m2.sender_email
        )
        JOIN users u ON u.email = m2.other_email
        WHERE m.sender_email = $1 OR m.recipient_email = $1
        ORDER BY m.post_id, other_email, m.timestamp DESC
        `,
        [userEmail]
      );
  
      res.json(result.rows);
    } catch (err) {
      console.error('Inbox fetch error:', err);
      res.status(500).json({ error: 'Failed to fetch inbox' });
    }
  });

// GET /api/messages/:postId - all messages for a post
router.get('/:postId', authenticateToken, async (req, res) => {
    const { postId } = req.params;
    const userEmail = req.user.email;
  
    try {
      const result = await pool.query(
        `SELECT * FROM messages
         WHERE post_id = $1 AND (sender_email = $2 OR recipient_email = $2)
         ORDER BY timestamp ASC`,
        [postId, userEmail]
      );
      res.json(result.rows);
    } catch (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });
  

// POST /api/messages - add a new message
router.post('/', authenticateToken, async (req, res) => {
  const { post_id, recipient_email, message } = req.body;
  const sender_email = req.user.email;

  if (!post_id || !recipient_email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO messages (post_id, sender_email, recipient_email, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [post_id, sender_email, recipient_email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message' });
  }
});


module.exports = router;
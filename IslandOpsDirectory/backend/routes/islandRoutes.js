const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const pool = require('../database');


router.get('/', authenticateUser, async (req, res) => {
    const user_id = req.user.user_id;
    try {
      const result = await pool.query('SELECT * FROM island_progress WHERE user_id = $1', [user_id]);
      res.json(result.rows[0]);
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch island progress.' });
    }
});

  
module.exports = router;
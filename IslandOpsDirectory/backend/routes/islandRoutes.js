const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authMiddleware');
const pool = require('../database');

// route to get current island progress
router.get('/', authenticateUser, async (req, res) => {
    const user_id = req.user.user_id;
    try {
        // gets current progress for the logged in user
        const result = await pool.query('SELECT * FROM progress_tracking WHERE user_id = $1', [user_id]);
        res.json(result.rows[0]);
    } 
    catch (err) {
        console.error(err);
        // sends error message to client if unsuccessful
        res.status(500).json({ error: 'Failed to fetch island progress.' });
    }
});

  
module.exports = router;
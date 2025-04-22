const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {createTask, getTasks, updateTask, deleteTask} = require('../models/Task');
const { updateIslandProgress } = require('../models/Island');
const authenticateUser = require("../middleware/authMiddleware");
const pool = require('../database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

console.log("taskRoutes loaded");


// route to create a new task
router.post('/', authenticateUser, async (req, res) => {
    const { title, description, completed, status, difficulty, points, due_date } = req.body;
    const user_id = req.user.user_id;

    try {
        const new_task = await createTask(user_id, title, description, completed, status, difficulty, points, due_date);
        // indicates success to client by sending new task details
        res.status(201).json(new_task);
    }
    catch (err) {
        console.error("Error in creating task:", err.message || err);
        // sends error message to client
        res.status(500).json({ error: 'Failed to create task.' });
    }
});


// route to get all tasks for a user
router.get('/', authenticateUser, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await getTasks(user_id);
        // indicates success to client by sending all the existing tasks
        res.json(result);
    }
    catch (err) {
        console.error(err);
        // sends error message to client
        res.status(400).json({ error: 'Failed to get tasks.' });
    }
});


// route to update a task
router.put('/:id', authenticateUser, async (req, res) => {
    const task_id = req.params.id;
    const user_id = req.user.user_id;
    const updates = req.body;

    try {
        const result = await updateTask(task_id, user_id, updates);
        if (!result) {
            // sends error message to client if task can't be found
            return res.status(401).json({ error: 'Task not found.' });
        }
        // logic for updating points and level if a task is completed
        if (updates.completed === true) {
            await updateIslandProgress(user_id, result.difficulty);
        }

        res.json(result);
    }
    catch (err) {
        console.error(err);
        // sends error message to client
        res.status(402).json({ error: 'Failed to update task.' });
    }
});


// route to delete task
router.delete('/:id', authenticateUser, async (req, res) => {
    const task_id = req.params.id;
    const user_id = req.user.user_id;

    try {
        const deletedTask = await deleteTask(task_id, user_id);
        // sends error message to client if task isn't found
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        // sends success message to client saying task is deleted
        res.json({ message: 'Task deleted', task: deletedTask });
    } 
    catch (err) {
        console.error(err);
        // sends error message to client
        res.status(501).json({ error: 'Failed to delete task.' });
    }
});


router.get('/sorted-by-energy/:energy', authenticateUser, async (req, res) => {
    // get the user_id of the user logged in and their current energy level
    const user_id = req.user.user_id;
    const energy = parseInt(req.params.energy);

    let difficultyOrder;
    // determine task sorting order based off of energy level
    // for users who are the two lowest energy levels
    if (energy <= 2) {
        difficultyOrder = ['Easy', 'Medium', 'Hard'];
    }
    // for users who are in the middle
    else if (energy === 3) {
        difficultyOrder = ['Medium', 'Easy', 'Hard'];
    }
    // for users who are the two highest energy levels
    else {
        difficultyOrder = ['Hard', 'Medium', 'Easy'];
    }

    try {
       // SQL query to pull from the database in the order of task difficulty based on the user's energy level
        const result = await pool.query(`
            SELECT * FROM "task"
            WHERE User_id = $1
            ORDER BY
                CASE difficulty
                    WHEN $2 THEN 1
                    WHEN $3 THEN 2
                    WHEN $4 THEN 3
                END
            `, [user_id, ...difficultyOrder]);

        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        // if error, send error message to client
        res.status(500).json({ error: 'Failed to fetch energy-based sorted tasks' });
    }
});


router.get('/sorted-by-date', authenticateUser, async (req, res) => {
    const user_id = req.user.user_id;

    try {
        const result = await pool.query(`
            SELECT * FROM "task"
            WHERE user_id = $1
            ORDER BY due_date ASC
            `, [user_id]);
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch tasks by due date' });
    }
});

module.exports = router;
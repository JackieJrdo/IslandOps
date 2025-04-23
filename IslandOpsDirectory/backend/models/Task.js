const pool = require('../database');

// function to create a new task
const createTask = async (user_id, title, description, completed, status, difficulty, points, due_date) => {
    const result = await pool.query(
        `INSERT INTO "task" 
        (user_id, title, description, completed, status, difficulty, points, due_date) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
        RETURNING *`,
        [user_id, title, description, completed, status, difficulty, points, due_date]
    );
    return result.rows[0];
};
// function to retrieve all the tasks 
const getTasks = async (user_id) => {
    const result = await pool.query('SELECT * FROM "task" WHERE user_id = $1', [user_id]);
    return result.rows;
};
// function to change certain task details
const updateTask = async (task_id, user_id, updates) => {
    const { title, description, completed, status, difficulty, points, due_date} = updates;

    const result = await pool.query(
        `UPDATE "task" SET 
        title = $1, 
        description = $2, 
        completed = $3, 
        status = $4, 
        difficulty = $5, 
        points = $6, 
        due_date = $7 
        WHERE id = $8 AND user_id = $9 
        RETURNING *`, 
        [title, description, completed, status, difficulty, points, due_date, task_id, user_id]
    );
    return result.rows[0];
};
// function to delete task
const deleteTask = async (task_id, user_id) => {
    const result = await pool.query('DELETE FROM task WHERE id = $1 AND user_id = $2 RETURNING *', [task_id, user_id]);
    return result.rows[0];
};


module.exports = { createTask, getTasks, updateTask, deleteTask };
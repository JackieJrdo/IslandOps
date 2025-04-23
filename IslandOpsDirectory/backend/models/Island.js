const pool = require('../database');
// standardize number of points for each type of task difficulty
const difficultyPoints = {
  Easy: 1,
  Medium: 3,
  Hard: 5,
};

const updateIslandProgress = async (user_id, difficulty) => {   
    // in case the user inputs 'easy' instead of 'Easy' to make sure it matches the difficultyPoints definitions
    const pointsToAdd = difficultyPoints[difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()] || 0;

  // get current progress from database
    const { rows } = await pool.query(`
    SELECT * FROM progress_tracking 
    WHERE user_id = $1`, 
    [user_id]
    );

    if (rows.length === 0) {
    throw new Error('No island progress found for this user.');
    }
    // pulls current points and adds the points for the completed task
    let points = rows[0].points + pointsToAdd;
    // pulls current level
    let level = rows[0].level;
    // logic for updating points and level when the user levels up
    while (points >= level * 10) {
        // keeps only leftover points
        points -= level * 10;
        level++;
    }
    // update database
    await pool.query(`
        UPDATE progress_tracking
        SET 
        level = $1,
        points = $2
        WHERE user_id = $3`, 
        [level, points, user_id]
    );
};


module.exports = { updateIslandProgress };

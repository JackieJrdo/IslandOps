const pool = require('../database');

const difficultyPoints = {
  Easy: 1,
  Medium: 3,
  Hard: 5,
};

const updateIslandProgress = async (user_id, difficulty) => {
  const pointsToAdd = difficultyPoints[difficulty];

  // Get current progress
  const { rows } = await pool.query(`
    SELECT * FROM island_progress 
    WHERE user_id = $1`, 
    [user_id]
    );

  if (rows.length === 0) {
    throw new Error('No island progress found for this user.');
  }

  const currentProgress = rows[0];
  const newTotalPoints = currentProgress.points + pointsToAdd;
  const pointsRequiredForLevelUp = currentProgress.level * 10;

  if (newTotalPoints >= pointsRequiredForLevelUp) {
    const leftoverPoints = newTotalPoints - pointsRequiredForLevelUp;
    const newLevel = currentProgress.level + 1;

    await pool.query(`
      UPDATE island_progress
      SET 
        level = $1,
        points = $2
      WHERE user_id = $3`, 
      [newLevel, leftoverPoints, user_id]
    );

  } 
  else {
    await pool.query(`
      UPDATE island_progress
      SET 
        points = points + $1
      WHERE user_id = $2`, 
    [pointsToAdd, user_id]
    );
  }
};


module.exports = { updateIslandProgress };

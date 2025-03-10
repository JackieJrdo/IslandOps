const pool = require('../database');
// function to insert user into database
const createUser = async (username, email, hashed_password) => {
    const result = await pool.query(
        "INSERT INTO user (username, email, password) VALUES ($1, $2, $3) RETURNING *",
        [username, email, hashed_password]
    );
    return result.rows[0];
};
// function to check if an email is already registered
const findEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM user WHERE email = $1", [email]
    );
    return result.rows[0];
}

const findUsername = async (username) => {
    const result = await pool.query(
        "SELECT * FROM user WHERE username = $1", [username]
    );
    return result.rows[0];
}

module.exports = {createUser, findEmail, findUsername};
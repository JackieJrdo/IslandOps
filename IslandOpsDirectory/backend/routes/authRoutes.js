const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {createUser, findEmail, findUsername} = require('../models/User');
const authenticateUser = require("../middleware/authMiddleware");
const pool = require('../database');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// register user
router.post('/register', async (req, res) => {
    const {firstname, lastname, username, email, password} = req.body;
    
    // checks to make sure all fields are given
    if (!firstname || !lastname || !username || !email || !password) {
        return res.status(400).json({error: 'Missing fields!'});
    }
    // checks if user is already registered by seeing if email is already used
    const existing_user = await findEmail(email);
    if (existing_user) {
        return res.status(400).json({error: 'User already registered!'});
    }
    // hashes password
    const hashed_password = await bcrypt.hash(password, 10);
    // adds the new user into database
    const new_user = await createUser(username, email, hashed_password, firstname, lastname);
    // creates default progress tracker
    await pool.query(`
        INSERT INTO progress_tracking (user_id, level, points)
        VALUES ($1, 1, 0)
      `, [new_user.id]);
    // generates JWT for new user
    const token = jwt.sign({user_id: new_user.id}, JWT_SECRET, {expiresIn: '7d'});
    // send message to frontend saying user registered successfully
    res.json({message: 'User registered successfully!', token});
}
);

// login user
router.post('/login', async (req, res) => {
    const {username, password} = req.body;
    // searches the database for inputted username
    const user = await findUsername(username);
    // if username doesn't exist, send error
    if (!user) {
        return res.status(401).json({error: 'Invalid username.'});
    }
    // checks if inputted password is correct
    const is_valid_password = await bcrypt.compare(password, user.password);
    // send error if password is wrong
    if (!is_valid_password) {
        return res.status(401).json({error: 'Invalid password.'});
    }
    // generates jwt for registered user
    const token = jwt.sign({user_id: user.id}, JWT_SECRET, {expiresIn: '7d'});
    // send message to frontend saying login was successful
    res.json({ message: 'Login successful!', token });
}
);

router.get("/protected", authenticateUser, (req, res) => {
    res.json({ message: "Welcome to the protected route!", user: req.user });
});

module.exports = router;
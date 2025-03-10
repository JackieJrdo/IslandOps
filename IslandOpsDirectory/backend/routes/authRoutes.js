const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {createUser, findEmail, findUsername} = require('../models/User');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// register user
router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;
    
    // checks to make sure all fields are given
    if (!username || !email || !password) {
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
    const new_user = await createUser(username, email, hashed_password);
    // generates JWT for new user
    const token = jwt.sign({userId: new_user.id}, JWT_SECRET, {expiresIn: '7d'});
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
        return res.status(401).json({error: 'Invalid email or password. Try again.'});
    }
    // checks if inputted password is correct
    const is_valid_password = await bcrypt.compare(password, user.password);
    // send error if password is wrong
    if (!is_valid_password) {
        return res.status(401).json({error: 'Invalid email or password. Try again.'});
    }
    // generates jwt for registered user
    const token = jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '7d'});
    // send message to frontend saying login was successful
    res.json({ message: 'Login successful!', token });
}
);

module.exports = router;
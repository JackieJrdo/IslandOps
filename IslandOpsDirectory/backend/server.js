require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const pool = require('./database');

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

connect();
async function connect() {
    try{
        // tests to see if database is connected by trying to make a query
        await pool.query('SELECT * FROM user');
        console.log(`Connected`);
    }
    catch (e) {
        console.error(`Connection failed ${e}`);
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Backend');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
    res.send('Welcome to the Backend API');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
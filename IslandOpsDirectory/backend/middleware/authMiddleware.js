const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateUser = (req, res, next) => {
    // gets the token from the authorization heading
    const token = req.header("Authorization");
    // if the token isn't provided, then throw an error and deny access
    if(!token) {
        return res.status(401).json({error: "Access denied. No token provided"});
    }

    try {
        // decodes the jwt to find out who the user is
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
        // assigns the decoded user info to the request object
        req.user = decoded;
        next();
    }
    catch(err) {
        // throws an error if the jwt is unable to be decoded
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authenticateUser;

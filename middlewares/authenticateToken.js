const jwt = require('jsonwebtoken');

app.use(express.json());

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Retrieve the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        req.user = user; // Attach user details to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;

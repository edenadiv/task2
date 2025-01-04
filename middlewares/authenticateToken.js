const jwt = require('jsonwebtoken');

const authenticateToken = (role = null) => (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Headers:', req.headers);//


    if (!token) {
        return res.status(401).json({ message: 'Token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        req.user = user;
        next();
    });
};

module.exports = authenticateToken;

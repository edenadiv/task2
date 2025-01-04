const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const authenticateToken = require('./middlewares/authenticateToken');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use((req, res, next) => {
    if (req.path === '/auth/signup' || req.path === '/auth/login') {
        return next();
    }
    authenticateToken()(req, res, next);
});

const courseRoutes = require('./routes/courses');

app.use('/courses', courseRoutes);

app.use('/auth', authRoutes);

app.get('/debug', authenticateToken(), (req, res) => {
    res.json({ message: 'Token is valid', user: req.user });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

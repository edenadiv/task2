const mongoose = require('mongoose');
const Staff = require('./models/Staff');
const Student = require('./models/Student');
const Course = require('./models/Course');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Student = require('../models/Student');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
    const { role, id, name, address, password, yearOfStudy } = req.body;

    try {
        // Validate required fields
        if (!role || !id || !name || !address || !password) {
            throw { status: 400, message: 'Missing required fields' };
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user based on role
        let user;
        if (role === 'staff') {
            user = new Staff({ id, name, address, password: hashedPassword });
        } else if (role === 'student') {
            if (!yearOfStudy) {
                throw { status: 400, message: 'Year of study is required for students' };
            }
            user = new Student({ id, name, address, password: hashedPassword, yearOfStudy });
        } else {
            throw { status: 400, message: 'Invalid role specified' };
        }

        await user.save();
        res.status(201).json({ message: `${role} registered successfully!` });
    } catch (error) {
        next(error); // Pass error to centralized handler
    }
});

router.post('/login', async (req, res, next) => {
    const { role, id, password } = req.body;

    try {
        if (!role || !id || !password) {
            throw { status: 400, message: 'Missing required fields' };
        }

        let user;
        if (role === 'staff') {
            user = await Staff.findOne({ id });
        } else if (role === 'student') {
            user = await Student.findOne({ id });
        } else {
            throw { status: 400, message: 'Invalid role specified' };
        }

        if (!user) {
            throw { status: 404, message: 'User not found' };
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw { status: 401, message: 'Invalid credentials' };
        }

        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(200).json({ token });
    } catch (error) {
        next(error); // Pass error to centralized handler
    }
});

module.exports = router;

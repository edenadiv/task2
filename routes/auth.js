const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Staff = require('../models/Staff');
const Student = require('../models/Student');

const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
    const { role, id, name, address, password, yearOfStudy } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Role-based user creation
        let user;
        if (role === 'staff') {
            user = new Staff({ id, name, address, password: hashedPassword });
        } else if (role === 'student') {
            user = new Student({ id, name, address, password: hashedPassword, yearOfStudy });
        } else {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        await user.save();
        res.status(201).json({ message: `${role} registered successfully!` });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { role, id, password } = req.body;

    try {
        // Find user by role and ID
        let user;
        if (role === 'staff') {
            user = await Staff.findOne({ id });
        } else if (role === 'student') {
            user = await Student.findOne({ id });
        } else {
            return res.status(400).json({ message: 'Invalid role specified' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, role },
            process.env.JWT_SECRET,
            { expiresIn: '10m' }
        );

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

module.exports = router;

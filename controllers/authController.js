const bcrypt = require('bcrypt');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

async function signUp(req, res) {
    const { name, address, role, password } = req.body;
    if (!name || !address || !role || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (role === 'student') {
            const newStudent = new Student({ name, address, password: hashedPassword });
            await newStudent.save();
            res.status(201).json({ message: 'Student registered successfully' });
        } else if (role === 'staff') {
            const newStaff = new Staff({ name, address, password: hashedPassword });
            await newStaff.save();
            res.status(201).json({ message: 'Staff registered successfully' });
        } else {
            res.status(400).json({ error: 'Invalid role specified' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Error registering user' });
    }
}

module.exports = { signUp };

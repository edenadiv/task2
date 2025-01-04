const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const Student = require('../models/Student');

router.get('/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('enrolledStudents');
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('courses');
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/create-course', async (req, res) => {
    try {
        const course = new Course({
            id: 'C001',
            name: 'Introduction to Programming',
            lecturer: 'Dr. Smith',
            credits: 4,
            maxStudents: 30,
        });
        await course.save();
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Test route to fetch all courses
router.get('/get-courses', async (req, res) => {
    try {
        const courses = await Course.find().populate('enrolledStudents');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

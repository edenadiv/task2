const express = require('express');
const Course = require('../models/Course');
const Student = require('../models/Student');
const authenticateToken = require('../middlewares/authenticateToken'); // Middleware for authentication

const router = express.Router();

// Add a course (staff only)
router.post('/', authenticateToken('staff'), async (req, res) => {
    const { id, courseName, lecturer, creditPoints, maxStudents } = req.body;

    try {
        // Validate input
        if (creditPoints < 3 || creditPoints > 5) {
            return res.status(400).json({ message: 'Credit points must be between 3 and 5' });
        }

        const course = new Course({ id, courseName, lecturer, creditPoints, maxStudents });
        await course.save();

        res.status(201).json({ message: 'Course added successfully', course });
    } catch (error) {
        res.status(500).json({ message: 'Error adding course', error: error.message });
    }
});

// View all courses
router.get('/', authenticateToken(), async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
});

// Register for a course (student only)
router.post('/register', authenticateToken('student'), async (req, res) => {
    const { courseId } = req.body;

    try {
        const student = await Student.findOne({ id: req.user.id });
        const course = await Course.findOne({ id: courseId });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.enrolledStudents.length >= course.maxStudents) {
            return res.status(400).json({ message: 'Course is full' });
        }

        if (student.registeredCourses.includes(course._id)) {
            return res.status(400).json({ message: 'Already registered for this course' });
        }

        const totalCredits = student.registeredCourses.reduce(async (total, courseId) => {
            const course = await Course.findById(courseId);
            return total + course.creditPoints;
        }, 0);

        if (totalCredits + course.creditPoints > 20) {
            return res.status(400).json({ message: 'Exceeds 20 credit points. Drop a course to proceed.' });
        }

        // Register the student
        student.registeredCourses.push(course._id);
        course.enrolledStudents.push(student._id);

        await student.save();
        await course.save();

        res.json({ message: 'Registered for course successfully', student });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for course', error: error.message });
    }
});

module.exports = router;

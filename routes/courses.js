const express = require('express');
const { check, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

router.post(
    '/',
    authenticateToken('staff'),
    [
        check('id').isInt().withMessage('Course ID must be an integer'),
        check('courseName').notEmpty().withMessage('Course name is required'),
        check('lecturer').notEmpty().withMessage('Lecturer name is required'),
        check('creditPoints').isInt({ min: 3, max: 5 }).withMessage('Credit points must be between 3 and 5'),
        check('maxStudents').isInt({ min: 1 }).withMessage('Maximum students must be a positive integer'),
    ],
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { id, courseName, lecturer, creditPoints, maxStudents } = req.body;
            const course = new Course({ id, courseName, lecturer, creditPoints, maxStudents });
            await course.save();

            res.status(201).json({ message: 'Course added successfully', course });
        } catch (error) {
            next(error);
        }
    }
);

router.post('/register', authenticateToken('student'), async (req, res, next) => {
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

        student.registeredCourses.push(course._id);
        course.enrolledStudents.push(student._id);

        await student.save();
        await course.save();

        res.json({ message: 'Registered for course successfully', student });
    } catch (error) {
        next(error);
    }
});

router.get('/', authenticateToken(), async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        next(error);
    }
});

module.exports = router;

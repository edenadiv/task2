const express = require('express');
const { check, validationResult } = require('express-validator');
const Course = require('../models/Course');
const Student = require('../models/Student');
const authenticateToken = require('../middlewares/authenticateToken');

const router = express.Router();

// Add a course (staff only)
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
            next(error); // Pass error to centralized handler
        }
    }
);

// View all courses
router.get('/', authenticateToken(), async (req, res, next) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        next(error); // Pass error to centralized handler
    }
});

module.exports = router;

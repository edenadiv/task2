const Student = require('../models/Student');
const Course = require('../models/Course');

const enrollStudent = async (studentId, courseId) => {
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
        throw new Error('Student or Course not found');
    }

    // Check if student is already enrolled
    if (student.courses.includes(courseId)) {
        throw new Error('Student is already enrolled in this course.');
    }

    // Add the student to the course's enrolledStudents
    course.enrolledStudents.push(studentId);

    // Add the course to the student's courses
    student.courses.push(courseId);

    await student.save();
    await course.save();

    return { message: 'Enrollment successful' };
};

module.exports = { enrollStudent };

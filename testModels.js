const mongoose = require('mongoose');
const Staff = require('./models/Staff');
const Student = require('./models/Student');
const Course = require('./models/Course');

// Load environment variables
require('dotenv').config();

const testDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Example: Create a Staff Member
        const staff = new Staff({
            id: 1,
            name: 'John Doe',
            address: '123 Staff St.',
            password: 'securepassword'
        });
        await staff.save();
        console.log('Staff member saved:', staff);

        // Example: Create a Student
        const student = new Student({
            id: 101,
            name: 'Jane Smith',
            address: '456 Student Ave.',
            yearOfStudy: 2,
            password: 'securepassword'
        });
        await student.save();
        console.log('Student saved:', student);

        // Example: Create a Course
        const course = new Course({
            id: 1001,
            courseName: 'Introduction to Programming',
            lecturer: 'Dr. Alan Turing',
            creditPoints: 3,
            maxStudents: 30
        });
        await course.save();
        console.log('Course saved:', course);

    } catch (error) {
        console.error('Error during test:', error.message);
    } finally {
        mongoose.connection.close();
    }
};

testDatabase();

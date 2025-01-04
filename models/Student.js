const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    yearOfStudy: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registeredCourses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ]
});

module.exports = mongoose.model('Student', studentSchema);

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    year: { type: Number, required: true },
    currentCredits: { type: Number, default: 0 },
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('Student', StudentSchema);

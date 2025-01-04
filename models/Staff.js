const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
});

module.exports = mongoose.model('Staff', StaffSchema);

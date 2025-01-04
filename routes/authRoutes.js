const express = require('express');
const router = express.Router();
const { signUp } = require('../controllers/authController');

// POST /signup route
router.post('/signup', signUp);

module.exports = router;

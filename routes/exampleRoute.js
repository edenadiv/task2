const express = require('express');
const { testController } = require('../controllers/exampleController');
const router = express.Router();

router.get('/test', testController);

module.exports = router;

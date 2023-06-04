const express = require('express');
const router = express.Router();

// import controller for index
const indexController = require('../controllers/indexController');

router.get('/', indexController.home );

module.exports = router;

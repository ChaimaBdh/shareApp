const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authentification.middleware');

router.get('/me', authMiddleware.validToken, userController.me );

module.exports = router;

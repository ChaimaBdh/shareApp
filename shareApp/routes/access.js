const express = require('express');
const router = express.Router();

const accessController = require('../controllers/accessController');

router.get('/login', accessController.loginForm );
router.post('/login', accessController.login );
router.get('/register', accessController.registerForm );
router.post('/register', accessController.register );
router.get('/logout', accessController.logout );

module.exports = router;

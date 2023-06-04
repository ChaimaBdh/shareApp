var express = require('express');
var router = express.Router();
const authMiddleware = require('../middlewares/authentification.middleware');

const shareController = require('../controllers/shareController');

router.get('/',authMiddleware.validToken, shareController.sendHTMLfile);

module.exports = router;

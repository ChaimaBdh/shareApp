const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authentification.middleware');

router.get('/',authMiddleware.validToken, itemController.getItems);
router.get('/others',authMiddleware.validToken, itemController.getOtherItems);
router.delete('/:id',authMiddleware.validToken,itemController.deleteItem);
router.post('/',authMiddleware.validToken, itemController.createItem);
router.put('/borrow/:itemId',authMiddleware.validToken, itemController.borrowItem);
router.put('/release/:itemId',authMiddleware.validToken,itemController.releaseItem);
router.put('/update/:itemId',authMiddleware.validToken, itemController.updateItem);


module.exports = router;

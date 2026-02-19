const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.delete('/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;

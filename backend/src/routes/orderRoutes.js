const express = require('express');
const router = express.Router();
const { createOrder, getAllOrders, updateOrderStatus, getUserOrders } = require('../controller/orderController');
const { verifyToken, optionalVerifyToken, isAdmin } = require('../middleware/authMiddleware');

router.post('/', optionalVerifyToken, createOrder);
router.get('/my-orders', verifyToken, getUserOrders);
router.get('/all', verifyToken, isAdmin, getAllOrders);
router.patch('/:id/status', verifyToken, isAdmin, updateOrderStatus);

module.exports = router;

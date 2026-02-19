const express = require('express');
const router = express.Router();
const { createReview, getProductReviews } = require('../controller/reviewController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/:productId', getProductReviews);
router.post('/', verifyToken, createReview);

module.exports = router;

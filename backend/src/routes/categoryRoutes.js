const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
router.get('/', categoryController.getCategories);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);
module.exports = router;

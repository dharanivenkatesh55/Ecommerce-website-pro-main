const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const multer = require('multer');
const path = require('path');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, 'uploads/'); },
  filename: (req, file, cb) => { cb(null, Date.now() + path.extname(file.originalname)); }
});
const upload = multer({ storage });
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', verifyToken, isAdmin, upload.array('images', 5), productController.createProduct);
router.put('/:id', verifyToken, isAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
module.exports = router;

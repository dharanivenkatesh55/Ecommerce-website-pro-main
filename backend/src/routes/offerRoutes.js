const express = require('express');
const router = express.Router();
const { getAllOffers, adminGetAllOffers, addOffer, toggleOfferStatus, deleteOffer } = require('../controller/offerController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', getAllOffers);
router.get('/admin', adminGetAllOffers);
router.post('/', upload.single('image'), addOffer);
router.patch('/:id/status', toggleOfferStatus);
router.delete('/:id', deleteOffer);

module.exports = router;

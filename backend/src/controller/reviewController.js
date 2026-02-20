const db = require('../config/db');

exports.createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id; // From verifyToken middleware

    try {
        await db.query(
            'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
            [productId, userId, rating, comment]
        );
        res.status(201).json({ message: 'Review added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProductReviews = async (req, res) => {
    const { productId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
            [productId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

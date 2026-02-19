const db = require('../config/db');

exports.getCart = async (req, res) => {
    const userId = req.user.id;
    try {
        const [rows] = await db.query(
            `SELECT c.product_id as id, c.quantity, p.name, p.price, p.brand, 
            (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as image
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addToCart = async (req, res) => {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    try {
        // Check if item already in cart
        const [existing] = await db.query('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);

        if (existing.length > 0) {
            await db.query('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?', [quantity || 1, userId, productId]);
        } else {
            await db.query('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)', [userId, productId, quantity || 1]);
        }
        res.json({ message: 'Added to cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.removeFromCart = async (req, res) => {
    const userId = req.user.id;
    const { productId } = req.params;

    try {
        await db.query('DELETE FROM cart WHERE user_id = ? AND product_id = ?', [userId, productId]);
        res.json({ message: 'Removed from cart' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.clearCart = async (req, res) => {
    const userId = req.user.id;
    try {
        await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        res.json({ message: 'Cart cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

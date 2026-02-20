const db = require('../config/db');

exports.createOrder = async (req, res) => {
    const { name, email, address, city, zip, totalPrice, items } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
        const [result] = await db.query(
            'INSERT INTO orders (total_price, status, customer_name, customer_email, shipping_address, city, zip, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [totalPrice, 'pending', name, email, address, city, zip, userId]
        );
        const orderId = result.insertId;

        // Insert order items
        if (items && items.length > 0) {
            const itemValues = items.map(item => [orderId, item.id, item.quantity, item.price]);
            await db.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?', [itemValues]);
        }

        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Order status updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

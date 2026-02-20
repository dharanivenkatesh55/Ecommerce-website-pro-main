const db = require('../config/db');

exports.getAllOffers = async (req, res) => {
    try {
        const [offers] = await db.query('SELECT * FROM offers WHERE is_active = TRUE ORDER BY created_at DESC');
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.adminGetAllOffers = async (req, res) => {
    try {
        const [offers] = await db.query('SELECT * FROM offers ORDER BY created_at DESC');
        res.json(offers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.addOffer = async (req, res) => {
    const { title, description } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    try {
        await db.query(
            'INSERT INTO offers (title, description, image_url) VALUES (?, ?, ?)',
            [title, description, imageUrl]
        );
        res.status(201).json({ message: 'Offer added successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.toggleOfferStatus = async (req, res) => {
    const { id } = req.params;
    const { is_active } = req.body;
    try {
        await db.query('UPDATE offers SET is_active = ? WHERE id = ?', [is_active, id]);
        res.json({ message: 'Offer status updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteOffer = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM offers WHERE id = ?', [id]);
        res.json({ message: 'Offer deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

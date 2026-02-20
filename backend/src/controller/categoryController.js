const db = require('../config/db');
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const [result] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    await db.query('UPDATE categories SET name=?, description=? WHERE id=?', [name, description, req.params.id]);
    res.json({ message: 'Category updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteCategory = async (req, res) => {
  try {
    await db.query('DELETE FROM categories WHERE id=?', [req.params.id]);
    res.json({ message: 'Category deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

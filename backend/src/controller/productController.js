const db = require('../config/db');
exports.getProducts = async (req, res) => {
  const { category } = req.query;
  try {
    let sql = 'SELECT p.*, c.name as category_name, (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as main_image FROM products p LEFT JOIN categories c ON p.category_id = c.id';
    let params = [];

    if (category) {
      sql += ' WHERE REPLACE(REPLACE(LOWER(c.name), " & ", "-"), " ", "-") = ?';
      params.push(category.toLowerCase());
    }

    if (req.query.search) {
      sql += category ? ' AND' : ' WHERE';
      sql += ' (p.name LIKE ? OR p.description LIKE ? OR p.brand LIKE ?)';
      const searchTerm = `%${req.query.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }
    const [rows] = await db.query(sql, params);
    res.json({ products: rows });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id=?', [req.params.id]);
    if (!products.length) return res.status(404).json({ message: 'Not found' });
    const [images] = await db.query('SELECT image_url FROM product_images WHERE product_id=?', [req.params.id]);
    products[0].images = images.map(i => i.image_url);
    res.json(products[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.createProduct = async (req, res) => {
  const { name, description, price, category_id, brand, stock } = req.body;
  const images = req.files ? req.files.map(f => '/uploads/' + f.filename) : [];
  try {
    const [result] = await db.query('INSERT INTO products (name, description, price, category_id, brand, stock) VALUES (?,?,?,?,?,?)', [name, description, price, category_id, brand, stock || 0]);
    const pid = result.insertId;
    if (images.length) {
      const vals = images.map(img => [pid, img]);
      await db.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [vals]);
    }
    res.status(201).json({ message: 'Product created', id: pid });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.updateProduct = async (req, res) => {
  const { name, description, price, category_id } = req.body;
  try {
    await db.query('UPDATE products SET name=?, description=?, price=?, category_id=? WHERE id=?', [name, description, price, category_id, req.params.id]);
    res.json({ message: 'Product updated' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.deleteProduct = async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id=?', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

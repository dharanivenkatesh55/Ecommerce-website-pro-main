const fs = require('fs');
const path = require('path');

const files = {
    'src/server.js': `const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.get('/', (req, res) => res.send('API is running...'));
app.listen(PORT, () => console.log('Server running on port ' + PORT));
`,

    'src/config/db.js': `const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
module.exports = pool.promise();
`,

    'src/routes/authRoutes.js': `const express = require('express');
const router = express.Router();
const { login, register } = require('../controller/authController');
router.post('/login', login);
router.post('/register', register);
module.exports = router;
`,

    'src/routes/categoryRoutes.js': `const express = require('express');
const router = express.Router();
const categoryController = require('../controller/categoryController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
router.get('/', categoryController.getCategories);
router.post('/', verifyToken, isAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdmin, categoryController.deleteCategory);
module.exports = router;
`,

    'src/routes/productRoutes.js': `const express = require('express');
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
`,

    'src/middleware/authMiddleware.js': `const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth) return res.status(401).json({ message: 'Access Denied' });
  try {
    const verified = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admins Only' });
};
module.exports = { verifyToken, isAdmin };
`,

    'src/controller/authController.js': `const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (!users.length) return res.status(400).json({ message: 'User not found' });
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: 'Invalid password' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, name: user.name });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(400).json({ message: 'Email already registered' });
    const hashed = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashed, role || 'customer']);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
`,

    'src/controller/categoryController.js': `const db = require('../config/db');
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
`,

    'src/controller/productController.js': `const db = require('../config/db');
exports.getProducts = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT p.*, c.name as category_name, (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) as main_image FROM products p LEFT JOIN categories c ON p.category_id = c.id');
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
`
};

let hasError = false;
Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, '..', filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content, { encoding: 'utf8', flag: 'w' });

    // Verify it's readable
    const check = fs.readFileSync(fullPath, 'utf8');
    if (check.charCodeAt(0) === 0xFEFF) {
        console.error('BOM STILL PRESENT in:', filePath);
        hasError = true;
    } else {
        console.log('OK (UTF-8):', filePath);
    }
});

if (!hasError) {
    console.log('\nAll files written as clean UTF-8!');
    console.log('Now run: npm run dev');
}

const db = require('../config/db');
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

exports.getProfile = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!users.length) return res.status(404).json({ message: 'User not found' });
    res.json(users[0]);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

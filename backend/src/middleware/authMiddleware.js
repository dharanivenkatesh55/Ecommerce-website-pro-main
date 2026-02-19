const jwt = require('jsonwebtoken');
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
const optionalVerifyToken = (req, res, next) => {
  const auth = req.header('Authorization');
  if (!auth) return next();
  try {
    const verified = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    next();
  }
};
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admins Only' });
};
module.exports = { verifyToken, optionalVerifyToken, isAdmin };

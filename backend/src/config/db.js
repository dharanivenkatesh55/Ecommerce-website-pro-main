const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

console.log(`🔌 Attempting to connect to DB at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306} (User: ${process.env.DB_USER})`);

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000, // Increase timeout to 10s
  family: 4 // Force IPv4
});

const promisePool = pool.promise();

promisePool.getConnection()
  .then(conn => {
    console.log(`✅ DB Connection Pool Created Successfully! Thread ID: ${conn.threadId}`);
    conn.release();
  })
  .catch(err => {
    console.error('❌ DB Pool Construction Error:', err.message);
  });

module.exports = promisePool;

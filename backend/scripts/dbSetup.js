const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const schemaPath = path.join(__dirname, '../../database/schema.sql');

async function setupDatabase() {
    let connection;
    try {
        console.log('\n=== E-Commerce Database Setup ===\n');

        console.log('Step 1: Connecting to MySQL...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || '127.0.0.1',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
        });
        console.log('✅ Connected to MySQL successfully!\n');

        // Step 1: Create database
        console.log('Step 2: Creating database "ecommerce"...');
        await connection.query('CREATE DATABASE IF NOT EXISTS ecommerce');
        console.log('✅ Database ready!\n');

        // Step 3: Switch to the database
        await connection.query('USE ecommerce');

        // Step 4: Create tables one by one
        console.log('Step 3: Creating tables...\n');

        const tables = [
            {
                name: 'users',
                sql: `CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role ENUM('admin', 'customer') DEFAULT 'customer',
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            },
            {
                name: 'categories',
                sql: `CREATE TABLE IF NOT EXISTS categories (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL UNIQUE,
                    description TEXT,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            },
            {
                name: 'products',
                sql: `CREATE TABLE IF NOT EXISTS products (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    category_id INT,
                    brand VARCHAR(255),
                    stock INT DEFAULT 0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
                )`
            },
            {
                name: 'product_images',
                sql: `CREATE TABLE IF NOT EXISTS product_images (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    product_id INT,
                    image_url VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                )`
            },
            {
                name: 'offers',
                sql: `CREATE TABLE IF NOT EXISTS offers (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    title VARCHAR(255),
                    description TEXT,
                    image_url VARCHAR(255) NOT NULL,
                    is_active BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )`
            }
        ];

        for (const table of tables) {
            try {
                await connection.query(table.sql);
                console.log(`  ✅ Table "${table.name}" created/verified`);
            } catch (err) {
                console.error(`  ❌ Error creating table "${table.name}": ${err.message}`);
            }
        }

        console.log('\n=== ✅ Database setup COMPLETE! ===');
        console.log('\nYour tables are ready:');
        const [rows] = await connection.query('SHOW TABLES');
        rows.forEach(row => {
            const tableName = Object.values(row)[0];
            console.log(`  - ${tableName}`);
        });
        console.log('\nNext steps:');
        console.log('  1. cd backend && npm run dev   (start backend on port 5000)');
        console.log('  2. cd frontend && npm run dev  (start frontend on port 5173)');

    } catch (error) {
        console.error('\n❌ Setup FAILED:', error.message);
        if (error.code === 'ECONNREFUSED') {
            console.error('\n👉 Fix: MySQL is not running. Open XAMPP and start MySQL.');
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n👉 Fix: Wrong MySQL username or password. Check backend/.env file.');
        }
    } finally {
        if (connection) {
            await connection.end();
            console.log('\nDatabase connection closed.');
        }
    }
}

setupDatabase();

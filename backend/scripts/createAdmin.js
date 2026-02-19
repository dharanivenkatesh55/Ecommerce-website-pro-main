const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const name = "Admin User";
        const email = "admin@example.com";
        const password = "adminpassword"; // CHANGE THIS ON DEPLOY
        const role = "admin";

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        console.log('==========================================');
        console.log('✅ ADMIN USER CREATED SUCCESSFULLY');
        console.log('Email: admin@example.com');
        console.log('Pass: adminpassword');
        console.log('==========================================');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
}

createAdmin();

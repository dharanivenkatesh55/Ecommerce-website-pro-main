const db = require('../src/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    try {
        const name = "Dharani Venkatesh";
        const email = "dharani@ecommerce.com";
        const password = "admin123";
        const role = "admin";

        const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log(`User with email ${email} already exists.`);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role]
        );

        console.log('==========================================');
        console.log('✅ NEW ADMIN USER CREATED SUCCESSFULLY');
        console.log(`Name:  ${name}`);
        console.log(`Email: ${email}`);
        console.log(`Pass:  ${password}`);
        console.log('==========================================');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err.message);
        process.exit(1);
    }
}

createAdmin();

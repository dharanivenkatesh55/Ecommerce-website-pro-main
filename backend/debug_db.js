const fs = require('fs');
const db = require('./src/config/db');

async function checkCategories() {
    try {
        const [categories] = await db.query('SELECT * FROM categories');
        const [products] = await db.query('SELECT p.id, p.name, p.category_id, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id');

        const output = { categories, products };
        fs.writeFileSync('db_check.json', JSON.stringify(output, null, 2), 'utf8');
        console.log('Done');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCategories();

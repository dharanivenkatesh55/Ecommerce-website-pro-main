const db = require('../src/config/db');

async function seedCategories() {
    try {
        const categories = [
            ['Electronics', 'Gadgets, phones, laptops and more'],
            ['Fashion', 'Clothing, shoes and accessories'],
            ['Home & Decor', 'Furniture, lighting and home improvements'],
            ['Beauty', 'Skincare, makeup and hair care'],
            ['Sports', 'Equipment and activewear']
        ];

        console.log('Seeding categories...');
        for (const [name, desc] of categories) {
            const [existing] = await db.query('SELECT id FROM categories WHERE name = ?', [name]);
            if (existing.length === 0) {
                await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, desc]);
                console.log(`✅ Added category: ${name}`);
            } else {
                console.log(`ℹ️ Category already exists: ${name}`);
            }
        }
        console.log('Seeding complete!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding categories:', err.message);
        process.exit(1);
    }
}

seedCategories();

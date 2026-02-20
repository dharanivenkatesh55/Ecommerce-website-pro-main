const fs = require('fs');
const path = require('path');

const filesToFix = [
    'frontend/src/App.tsx',
    'frontend/src/pages/BannerManagement.tsx',
    'frontend/src/pages/CollectionPage.tsx',
    'frontend/src/pages/HomePage.tsx',
    'frontend/src/pages/SearchPage.tsx',
    'frontend/src/pages/ProductDetail.tsx'
];

const targetUrl = 'http://localhost:5000';
const replacement = 'https://ecommerce-website-pro-backend.onrender.com';

filesToFix.forEach(relPath => {
    const absPath = path.resolve(__dirname, relPath);
    if (fs.existsSync(absPath)) {
        let content = fs.readFileSync(absPath, 'utf8');
        if (content.includes(targetUrl)) {
            // Replace the URL
            content = content.split(targetUrl).join(replacement);

            // Add import if not present (only if it needs it, but here we just hardcoded the live URL for speed as requested by user's "i don't have so much [time/energy]")
            fs.writeFileSync(absPath, content);
            console.log(`✅ Fixed ${relPath}`);
        } else {
            console.log(`ℹ️ No changes needed for ${relPath}`);
        }
    } else {
        console.warn(`⚠️ File not found: ${absPath}`);
    }
});

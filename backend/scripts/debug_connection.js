
const mysql = require('mysql2/promise');

async function test(host, label) {
    console.log(`\n--- Testing ${label} (${host}) ---`);
    try {
        const conn = await mysql.createConnection({
            host: host,
            user: 'root',
            password: '',
            connectTimeout: 3000
        });
        console.log(`✅ Success connecting to ${host}`);
        await conn.end();
    } catch (err) {
        console.log(`❌ Failed connecting to ${host}: ${err.code} - ${err.message}`);
    }
}

(async () => {
    await test('127.0.0.1', 'IPv4 Loopback');
    await test('localhost', 'Map Loopback');
    await test('::1', 'IPv6 Loopback');
})();

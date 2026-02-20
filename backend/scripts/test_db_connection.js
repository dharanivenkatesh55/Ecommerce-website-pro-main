
const mysql = require('mysql2/promise');

(async () => {
    console.log('Testing HARDCODED Localhost Connection...');
    const config = {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'ecommerce',
        connectTimeout: 5000 // 5 seconds timeout
    };

    console.log('Config:', config);

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connection Successful!');
        await connection.end();
    } catch (error) {
        console.error('❌ Connection Failed:', error.message);
        console.error('Error Code:', error.code);
    }
})();

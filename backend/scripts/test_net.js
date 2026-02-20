
const net = require('net');

const port = 3306;
const hosts = ['127.0.0.1', 'localhost', '::1'];

function checkPort(host) {
    return new Promise((resolve) => {
        console.log(`Checking connection to ${host}:${port}...`);
        const socket = new net.Socket();

        socket.setTimeout(2000); // 2 second timeout

        socket.on('connect', () => {
            console.log(`✅ SUCCESSFULLY connected to ${host}:${port} via TCP`);
            socket.destroy();
            resolve(true);
        });

        socket.on('timeout', () => {
            console.log(`❌ TIMEOUT connecting to ${host}:${port}`);
            socket.destroy();
            resolve(false);
        });

        socket.on('error', (err) => {
            console.log(`❌ ERROR connecting to ${host}:${port} - ${err.message}`);
            resolve(false);
        });

        socket.connect(port, host);
    });
}

(async () => {
    console.log('--- Network Connectivity Test ---');
    for (const host of hosts) {
        await checkPort(host);
    }
    console.log('---------------------------------');
})();

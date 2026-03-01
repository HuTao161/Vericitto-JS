// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const publicPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    let filePath;

    if (req.url === '/') {
        filePath = path.join(publicPath, 'index.html');
    } else {
        filePath = path.join(publicPath, req.url);
    }

    // Pastikan file ada
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        // Tentukan Content-Type
        const ext = path.extname(filePath);
        const types = {
            '.html': 'text/html',
            '.js': 'application/javascript',
            '.css': 'text/css'
        };
        res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
        fs.createReadStream(filePath).pipe(res);
    } else {
        res.writeHead(404);
        res.end('404 Not Found');
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});

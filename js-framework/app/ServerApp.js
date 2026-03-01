// ServerApp.js
const http = require('http');
const Router = require('./Router');

class ServerApp {          
    constructor() {
        this.router = new Router();
    }

    get(path, handler) {
        this.router.get(path, handler);
    }

    listen(port) {
        const server = http.createServer((req, res) => {
            this.router.handle(req, res);
        });

        server.listen(port, () => {
            console.log(`[ Hey, localhost has been running on http://localhost:${port} Cito ]`);
        });
    }
}

module.exports = ServerApp; 

class Router {
    constructor() {
        this.routes = {};
    }

    get(path, handler) {
        this.routes[path] = handler;
    }

    handle(req, res) {
        const handler = this.routes[req.url];
        if (!handler) {
            res.writeHead(404);
            return res.end('404 Not Found');
        }
        handler(req, res);
    }
}

module.exports = Router;

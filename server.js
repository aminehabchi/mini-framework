const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = __dirname; // Serve files from the same directory as server.js

const server = http.createServer((req, res) => {
    let filePath = path.join(PUBLIC_DIR, req.url);
    const ext = path.extname(filePath).toLowerCase();

    // MIME types for known file extensions
    const mimeTypes = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif",
        ".svg": "image/svg+xml",
        ".txt": "text/plain",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Serve static files if they exist
    fs.stat(filePath, (err, stats) => {
        if (!err && stats.isFile()) {
            res.writeHead(200, { "Content-Type": contentType });
            return fs.createReadStream(filePath).pipe(res);
        }

        // If file doesn't exist, serve index.html (without redirecting)
        const indexPath = path.join(PUBLIC_DIR, "index.html");
        fs.readFile(indexPath, (err, data) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading index.html");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

/* Simple file server */

const http = require('http');
const fs = require('fs');
const PORT = 8080;

//handle 500
function handleErr(err, res) {
    if (err) {
        res.statusCode = 500;
        res.end('500 Error.');
    };
}

//handle dynamic content types
function guessContentType(file) {
    if (file.endsWith(".htm") || file.endsWith(".html")) return 'text/html';
    if (file.endsWith(".js")) return 'application/javascript';
    if (file.endsWith(".css")) return 'text/css';
    return 'text/plain'
}

//serve file
function serveFile(path, res, statusCode) {
    fs.readFile(__dirname + '/' + path, (err, data) => {
        handleErr(err, res);
        res.writeHeader(statusCode || 200, {
            "Content-type": guessContentType(path)
        });
        res.end(data);
        console.log(`Served ${path}`);
    })
}

//create server
http.createServer(function (req, res) {
    if (req.url === '/') {
        return serveFile('/static/test.html', res);
    }
    if (req.url.includes('/static')) {
        return serveFile(req.url, res)
    }
    serveFile('/static/404.html', res);
}).listen(PORT);

console.log(`listening on port ${PORT}`);
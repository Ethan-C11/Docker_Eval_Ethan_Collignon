const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;

http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'assets/index.html');

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Erreur interne du serveur');
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        }
    });
}).listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
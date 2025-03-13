const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Set the file path based on the requested URL
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  // Read the requested file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // File not found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 File Not Found</h1>', 'utf8');
      } else {
        // Internal server error
        res.writeHead(500);
        res.end(`<h1>500 Server Error: ${err.code}</h1>`);
      }
    } else {
      // Serve the file with appropriate MIME type
      res.writeHead(200, { 'Content-Type': mime.lookup(filePath) });
      res.end(content, 'utf8');
    }
  });
});

// Set server port and start listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

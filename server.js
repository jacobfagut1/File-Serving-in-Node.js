const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const multer = require('multer');  // Import multer for file uploads

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Upload files to the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Generate a unique file name
  }
});

// Initialize multer with file size limit and file type filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];  // Allowed MIME types
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);  // Accept file
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'));
    }
  }
});

// Create the 'uploads' folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/upload') {
    // Handle file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h1>Error: ${err.message}</h1>`);
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`<h1>File uploaded successfully: ${req.file.filename}</h1>`);
      }
    });
  } else if (req.url === '/' || req.url === '/index.html') {
    // Serve the HTML form
    fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end('<h1>500 Server Error</h1>');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf8');
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

// Set server port and start listening
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

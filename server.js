const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  res.writeHead(200, { 'Content-Type': 'text/html' });

  if (parsedUrl.pathname === '/') {
    res.end('<h1>Welcome to the Home Page</h1>');
  } else if (parsedUrl.pathname === '/about') {
    res.end('<h1>About Us</h1><p>This is the about page.</p>');
  } else if (parsedUrl.pathname === '/contact') {
    res.end('<h1>Contact</h1><p>Email: example@example.com</p>');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  }
});

const PORT = 2089;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

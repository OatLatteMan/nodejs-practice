const express = require('express');
const app = express();
const PORT = 2089;

app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next(); // Pass control to the next handler
  });

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse URL-encoded form data

const logAbout = (req, res, next) => {
    console.log('Profile route hit!');
    next();
  };

  app.get('/profile', logAbout, (req, res) => {
    res.send('Profile page with route-specific middleware');
  });

// Root route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// About route
app.get('/about', (req, res) => {
  res.send('About page via Express');
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

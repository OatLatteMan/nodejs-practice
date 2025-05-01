const express = require('express');
const app = express();
const PORT = 2089;
const path = require('path');

app.use(express.static('public'));

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// Products routes
const productsRoutes = require('./routes/productsRoutes');
app.use('/products', productsRoutes);

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

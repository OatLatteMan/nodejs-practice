const express = require('express');
const path = require('path');
const app = express();
const PORT = 2089;
const session = require('express-session');

app.use(session({
  secret: 'come-on-you-spurs', // replace with an env var in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));
app.use(express.json()); // parse JSON body
app.use(express.static(path.join(__dirname, 'public')));

// Products routes
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});

const productRoutes = require('./routes/productsRoutes');
app.use('/api/products', productRoutes);

// manage products route
app.get('/manage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-products.html'));
});

// API routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/user', userRoutes);

// blog routes
const blogRoutes = require('./routes/blogRoutes');
app.use('/blog', blogRoutes);

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Pass control to the next handler
});

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

// something went off and I can't start the server by
// "node server.js" command. I'll try fixing that tomorrow
// so wish me a good luck, please
// I'll also prepare a "README" file for both projects

require('dotenv').config();
console.log('SESSION_SECRET is:', process.env.SESSION_SECRET);
const express = require('express');
const path = require('path');
const app = express();
const PORT = 2089;
const session = require('express-session');
const authRoutes = require('./routes/authRoutes')
const protectedRoutes = require('./routes/protectedRoutes')

app.use(session({
  secret: process.env.SESSION_SECRET || 'my_super_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: false           // true only if using HTTPS
  }
}));

app.use(express.json());

// protected welcome.html route
app.get('/welcome.html', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/auth'); // or '/auth.html' depending on your setup
  }
  res.sendFile(__dirname + '/public/welcome.html');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/protected-routes', protectedRoutes);

// login/regisrer page
app.use('/api/auth', authRoutes);

app.get('/auth', (req, res) => {
  if (req.session.user) {
    return res.redirect('/welcome.html');
  }
  res.sendFile(__dirname + '/public/auth.html');
});

// Products routes
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});

// direct json, with it's contains shown
const productRoutesFs = require('./routes/productsRoutes');
const productRoutesLowdb = require('./routes/productsRoutesLowdb')

app.use('/api/products-fs', productRoutesFs);
app.use('/api/products-lowdb', productRoutesLowdb)

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

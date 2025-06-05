// something went off and I can't start the server by
// "node server.js" command. I'll try fixing that tomorrow
// so wish me a good luck, please
// I'll also prepare a "README" file for both projects

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import protectedRoutes from './routes/protectedRoutes.js';
import productRoutesFs from './routes/productsRoutes.js';
import productRoutesLowdb from './routes/productsRoutesLowdb.js';
import apiRoutes from './routes/apiRoutes.js';
import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const app = express();
const PORT = 2089;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('SESSION_SECRET is:', process.env.SESSION_SECRET);

app.use(session({
  secret: process.env.SESSION_SECRET || 'my_super_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1 hour
    secure: false
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Protected welcome route
app.get('/welcome.html', (req, res) => {
  if (!req.session.user) return res.redirect('/auth');
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

// Auth routes
app.use('/api/auth', authRoutes);
app.use('/protected-routes', protectedRoutes);

app.get('/auth', (req, res) => {
  if (req.session.user) return res.redirect('/welcome.html');
  res.sendFile(path.join(__dirname, 'public', 'auth.html'));
});

// Products (add and manage views)
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'add-product.html'));
});

app.get('/manage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manage-products.html'));
});

// Backend routes
app.use('/api/products-fs', productRoutesFs);
app.use('/api/products-lowdb', productRoutesLowdb);

// API routes
app.use('/api', apiRoutes);
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route-specific middleware example
const logAbout = (req, res, next) => {
  console.log('Profile route hit!');
  next();
};

app.get('/profile', logAbout, (req, res) => {
  res.send('Profile page with route-specific middleware');
});

// Root routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// 404 fallback
app.use((req, res) => {
  res.status(404).send('404 - Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}`);
});

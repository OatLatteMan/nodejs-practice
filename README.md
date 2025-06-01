# 🛒 Node.js Product Management App

[![Node.js](https://img.shields.io/badge/Node.js-18.x-brightgreen?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue?logo=express)]
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?logo=javascript)]
[![Status](https://img.shields.io/badge/Project-In%20Progress-orange)]
[![License](https://img.shields.io/badge/License-MIT-informational)]

This is a simple full-stack Node.js application that allows users to register, log in, and manage a product list using session-based authentication. It uses Express.js for routing, session storage for authentication, and vanilla JavaScript for frontend interactivity.

---

## 🌟 Features

- User registration and login
- "Remember me" login option (extends session duration)
- Protected routes (e.g. `/welcome.html`)
- Logout functionality
- Add/view/edit/delete products
- Frontend validation and toasts
- Backend validation and clear error messages
- Styled with clean, responsive HTML/CSS

---

## 🔐 Authentication

- Session-based login system using `express-session`
- "Remember me" option sets cookie expiration to 7 days
- Redirection based on login status (e.g., logged-in users are redirected from `/auth` to `/welcome.html`)

---

## 🛠️ Technologies Used

- Node.js
- Express.js
- JavaScript (ES6+)
- HTML5 / CSS3
- `express-session` for session management
- bcrypt for password hashing

## 🚀 Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/OatLatteMan/nodejs-practice.git

2. Navigate into the project folder:
    cd nodejs-practice

3. Install dependencies:
    npm install

4. Start the server:
    node server.js

5. Reach for any route in server.js via:
    http://127.0.0.1:2089/


Demo login:
    login: userHello / password: userHello


## 📌 Dependencies

    - express
    - express-session
    - bcrypt
    - path
    - fs (for JSON file storage)

## Folder Structure

📦 project-root

    ┣ 📂 public/              # Static files (HTML, CSS, client JS)
    ┣ 📂 routes/              # Express routes
    ┣ 📂 utils/               # Utility functions and storage
    ┣ 📜 server.js            # Main server file
    ┗ 📜 README.md            # Project overview


## 👤 Author: GitHub [OatLatteMan](https://github.com/OatLatteMan)

Feel free to reach out for collaboration or feedback!

## 📄 License

This project is for educational and portfolio use.

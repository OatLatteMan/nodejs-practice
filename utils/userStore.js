const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Read all users from the file
async function loadUsers() {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Write all users to the file
async function saveUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Find one user by username
async function findUser(username) {
  const users = await loadUsers();
  return users.find(user => user.username === username);
}

// Add a new user
async function addUser({ username, password }) {
  const users = await loadUsers();

  // Hash password before storing
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });

  await saveUsers(users);
}

module.exports = {
  loadUsers,
  saveUsers,
  findUser,
  addUser,
};

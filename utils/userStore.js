const fs = require('fs/promises');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// Read all users from the file
async function readUsers() {
  try {
    const data = await fs.readFile(usersFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return []; // Return empty list if file doesn't exist
  }
}

// Write all users to the file
async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

// Find one user by username
async function findUser(username) {
  const users = await readUsers();
  return users.find(u => u.username === username);
}

// Add a new user
async function addUser(user) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}

module.exports = {
  readUsers,
  writeUsers,
  findUser,
  addUser,
};

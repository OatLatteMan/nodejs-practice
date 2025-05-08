const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '..', 'data', 'users.json');

async function getUsers() {
  const data = await fs.readFile(usersFile, 'utf-8');
  return JSON.parse(data);
}

async function saveUsers(users) {
  await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
}

async function createUser(username, password) {
  const users = await getUsers();
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    username,
    password: hashedPassword
  };
  users.push(newUser);
  await saveUsers(users);
  return newUser;
}

async function findUserByUsername(username) {
  const users = await getUsers();
  return users.find(user => user.username === username);
}

module.exports = { createUser, findUserByUsername };

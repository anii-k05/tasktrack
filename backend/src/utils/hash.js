const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function comparePasswords(password, hash) {
  return bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePasswords };

const db = require('../db');

const createUser = (name, email, hashedPassword, callback) => {
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, hashedPassword], callback);
};

const findUserByEmail = (email, callback) => {
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], callback);
};

module.exports = {
  createUser,
  findUserByEmail
};

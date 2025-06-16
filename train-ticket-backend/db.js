// db.js
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',        // Set your MySQL password
  database: 'irctc_db' // Create this DB manually or via script
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ MySQL Connected');
});

module.exports = connection;

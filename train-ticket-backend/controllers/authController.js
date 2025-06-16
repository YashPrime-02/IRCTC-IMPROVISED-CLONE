const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

// 🔐 Signup Controller
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'User already exists or DB error' });
      return res.status(201).json({ message: 'User registered successfully' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
};

// 🔑 Login Controller
exports.login = (req, res) => {
  const { email, password } = req.body;
  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'User not found' });
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, 'secretKey123', { expiresIn: '1h' }); // Replace with env var
    res.json({ message: 'Login successful', token, name: user.name });
  });
};

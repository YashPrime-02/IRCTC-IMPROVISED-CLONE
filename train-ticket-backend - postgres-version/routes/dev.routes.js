const express = require('express');
const router = express.Router();
const db = require('../middleware/models');

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const users = await db.users.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err });
  }
});

// ✅ DELETE all users
router.delete('/users', async (req, res) => {
  try {
    await db.users.destroy({ where: {}, truncate: true });
    res.status(200).json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users', error: err });
  }
});

module.exports = router;
// ✅ POST - Create a new user
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await db.users.create({ name, email, password });
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

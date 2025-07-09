const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// 🔁 Health Check / Render Keep-Alive Ping
router.get('/ping', (req, res) => {
  console.log("📡 Ping received from cron or Render health check at", new Date().toISOString());
  res.status(200).json({
    status: '✅ IRCTC backend awake',
    time: new Date().toISOString(),
    server: 'Render (Node.js + Supabase)',
  });
});

// 👤 Get All Users
router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// 🗑️ Delete All Users (except system user ID = 0)
router.delete('/users', async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().neq('id', 0);
    if (error) throw error;
    res.status(200).json({ message: 'All users deleted (except ID 0)' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users', error: err.message });
  }
});

// ➕ Add User Manually
router.post('/users', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password }])
      .select()
      .single();
    if (error) throw error;
    res.status(201).json({ message: 'User created', user: data });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

module.exports = router;

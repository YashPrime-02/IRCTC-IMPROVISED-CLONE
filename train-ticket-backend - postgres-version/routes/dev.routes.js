const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// ✅ GET all users
router.get('/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;

    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// ✅ DELETE all users
router.delete('/users', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .neq('id', 0); // delete all except system user (optional)

    if (error) throw error;

    res.status(200).json({ message: 'All users deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users', error: err.message });
  }
});

// ✅ POST - Create new user (manual insert)
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

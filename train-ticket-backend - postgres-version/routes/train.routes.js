const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// 🔁 Bulk insert trains (optional dev route)
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trains').insert(req.body);
    if (error) throw error;
    res.status(201).json({ message: 'Trains added successfully.', data });
  } catch (err) {
    console.error('❌ Error adding trains:', err.message);
    res.status(500).json({ error: 'Failed to add trains.' });
  }
});

// 🧪 Get all trains
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trains').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching trains:', err.message);
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

module.exports = router;

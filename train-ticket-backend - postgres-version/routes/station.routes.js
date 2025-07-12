const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// 🔁 Bulk insert stations
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stations').insert(req.body, { upsert: true });
    if (error) throw error;
    res.status(201).json({ message: 'Stations added successfully.', data });
  } catch (err) {
    console.error('❌ Error adding stations:', err.message);
    res.status(500).json({ error: 'Failed to add stations.' });
  }
});

// 🧪 Get all stations
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('stations').select('*');
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('❌ Error fetching stations:', err.message);
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// 🔍 Search trains by source and destination (partial & case-insensitive match)
router.post('/search', async (req, res) => {
  const { source, destination } = req.body;

  console.log('📥 Train search request received:', { source, destination });

  if (!source || !destination) {
    return res.status(400).json({ message: "Source and destination are required." });
  }

  try {
    const { data, error } = await supabase
      .from('trains')
      .select('*')
      .ilike('sourcecode', `%${source.trim()}%`)
      .ilike('destinationcode', `%${destination.trim()}%`);

    if (error) throw error;

    console.log(`✅ Found ${data.length} train(s) matching "${source}" ➝ "${destination}"`);
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error searching trains:', err.message);
    res.status(500).json({ error: 'Failed to search trains', details: err.message });
  }
});

// 🔁 Bulk insert trains
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trains').insert(req.body);
    if (error) throw error;
    res.status(201).json({ message: 'Trains added successfully.', data });
  } catch (err) {
    console.error('❌ Error adding trains:', err.message);
    res.status(500).json({ error: 'Failed to add trains', details: err.message });
  }
});

// 🧪 Get all trains
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase.from('trains').select('*');
    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Error fetching trains:', err.message);
    res.status(500).json({ error: 'Failed to fetch trains', details: err.message });
  }
});

module.exports = router;

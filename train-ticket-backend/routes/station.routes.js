const express = require('express');
const router = express.Router();
const db = require('../models');
const Station = db.stations;

// 🔁 Bulk insert stations
router.post('/', async (req, res) => {
  try {
    await Station.bulkCreate(req.body, { ignoreDuplicates: true });
    res.status(201).json({ message: 'Stations added successfully.' });
  } catch (err) {
    console.error('❌ Error adding stations:', err);
    res.status(500).json({ error: 'Failed to add stations.' });
  }
});

// 🧪 Get all stations
router.get('/', async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stations' });
  }
});

module.exports = router;

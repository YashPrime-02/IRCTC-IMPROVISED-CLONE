const express = require('express');
const router = express.Router();
const db = require('../middleware/models');
const Train = db.trains;

// 🔁 Bulk insert trains
router.post('/', async (req, res) => {
  try {
    await Train.bulkCreate(req.body);
    res.status(201).json({ message: 'Trains added successfully.' });
  } catch (err) {
    console.error('❌ Error adding trains:', err);
    res.status(500).json({ error: 'Failed to add trains.' });
  }
});

// 🧪 Get all trains
router.get('/', async (req, res) => {
  try {
    const trains = await Train.findAll();
    res.json(trains);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trains' });
  }
});

module.exports = router;

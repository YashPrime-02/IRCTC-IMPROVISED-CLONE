const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabaseClient');

// ✅ POST - Save Booking
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([req.body])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Booking saved', data });
  } catch (err) {
    console.error('❌ Booking save error:', err.message);
    res.status(500).json({ message: 'Failed to save booking', error: err.message });
  }
});

// ✅ GET - Get All Bookings by Email
router.get('/', async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('email', email)
      .order('createdAt', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    console.error('❌ Booking fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch bookings', error: err.message });
  }
});

// ✅ DELETE - Delete Booking by ID
router.delete('/:id', async (req, res) => {
  const bookingId = req.params.id;

  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    console.error('❌ Booking delete error:', err.message);
    res.status(500).json({ message: 'Failed to delete booking', error: err.message });
  }
});

module.exports = router;

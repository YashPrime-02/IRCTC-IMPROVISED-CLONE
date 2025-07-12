require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./utils/supabaseClient');

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// 🔁 DEV ROUTES
app.get('/api/dev/ping', (req, res) => {
  console.log("📡 Ping received at", new Date().toISOString());
  res.status(200).json({
    status: '✅ IRCTC backend awake',
    time: new Date().toISOString(),
    server: 'Render (Node.js + Supabase)',
  });
});

app.get('/api/dev/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase.from('users').select('*');
    if (error) throw error;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

app.delete('/api/dev/users', async (req, res) => {
  try {
    const { error } = await supabase.from('users').delete().neq('id', 0);
    if (error) throw error;
    res.status(200).json({ message: 'All users deleted (except ID 0)' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting users', error: err.message });
  }
});

app.post('/api/dev/users', async (req, res) => {
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

// 🧭 Main Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/station', require('./routes/station.routes'));
app.use('/api/trains', require('./routes/train.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

// 🚀 Root Route
app.get('/', (req, res) => {
  res.send('🚆 IRCTC backend running with Supabase + Render + Cron');
});

// 🔥 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}`);
});

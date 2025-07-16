require('dotenv').config();
const express = require('express');
const cors = require('cors');
const supabase = require('./utils/supabaseClient');

const app = express();

// ✅ CORS Middleware (dynamic)
const allowedOrigins = [
  'http://localhost:4200',
  'https://fabulous-sunburst-e594b4.netlify.app',
  'https://irctc-improvised-clone-6gaf.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`❌ CORS error: Origin ${origin} not allowed`));
    }
  },
  credentials: true
}));

// ✅ Body parser middleware — MUST BE HERE to read JSON in req.body
app.use(express.json());

/* --------------------------------
   🔁 DEV ROUTES
-------------------------------- */
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
    console.log("🔐 DEV signup req.body:", req.body);
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

/* --------------------------------
   🧭 MAIN ROUTES
-------------------------------- */
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/station', require('./routes/station.routes'));
app.use('/api/trains', require('./routes/train.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));

/* --------------------------------
   ✅ Health Route (for Render)
-------------------------------- */
app.get('/api/health', (req, res) => {
  res.status(200).send('✅ Backend is alive');
});

/* --------------------------------
   🏁 Root Route
-------------------------------- */
app.get('/', (req, res) => {
  res.send('🚆 IRCTC backend running with Supabase + Render + Cron');
});

/* --------------------------------
   🔥 Start Server
-------------------------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server live at http://localhost:${PORT}`);
});

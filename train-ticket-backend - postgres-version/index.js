const express = require("express");
const cors = require("cors");
const db = require("./middleware/models");              // ✅ Sequelize instance with registered models
require("dotenv").config();                             // ✅ Load environment variables from .env
const morgan = require("morgan");
const logger = require("./utils/logger");
const requestLogger = require("./controllers/requestLogger");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Log all incoming HTTP requests
app.use(requestLogger);

// ✅ Pipe Morgan logs into Winston logger for HTTP logging
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan("combined", { stream }));

// ✅ Global middleware for CORS and body parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Register routes
app.use("/api/auth", require("./routes/auth.routes"));           // User login/signup
app.use("/api/test", require("./routes/test.routes"));           // Token-protected test route
app.use("/api/trains", require("./routes/train.routes"));        // Train search
app.use("/api/stations", require("./routes/station.routes"));    // Station list
app.use("/api/dev", require("./routes/dev.routes"));             // Developer utilities
app.use("/api/bookings", require("./routes/booking.routes"));    // Booking routes

// ✅ Connect to Supabase PostgreSQL and optionally sync models
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully.");
    
    // ❗ Optional: Only use sync if you're not managing schema manually
    // For Supabase, avoid syncing unless you're confident
    // return db.sequelize.sync({ alter: true });

    console.log("🛠️ Skipping model sync. Using Supabase-managed schema.");
    
    // ✅ Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to PostgreSQL:", err);
  });

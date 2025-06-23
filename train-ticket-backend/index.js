const express = require("express");
const cors = require("cors");
const db = require("./middleware/models"); // Sequelize instance
require("dotenv").config(); // Load environment variables from .env
const morgan = require('morgan');
const logger = require('./utils/logger');
const app = express();
const PORT = process.env.PORT || 8080;
const requestLogger = require('./controllers/requestLogger');
app.use(requestLogger); // 🛜 Apply logging to all routes




// HTTP logs using Morgan + Winston
const stream = {
  write: (message) => logger.http(message.trim())
};
app.use(morgan('combined', { stream }));



// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root route - Health check
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Routes
app.use("/api/auth", require("./routes/auth.routes"));      // Login/Signup
app.use("/api/test", require("./routes/test.routes"));      // Protected test route
app.use("/api/trains", require("./routes/train.routes"));   // Train search
app.use("/api/stations", require("./routes/station.routes"));// Station list
app.use("/api/dev", require("./routes/dev.routes"));        // Dev tools: GET/DELETE users
app.use("/api/bookings", require("./routes/booking.routes")); // Booking routes


// ✅ Connect and sync DB
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully.");
    // 🔁 Alter instead of just sync to update schema (e.g., adding 'date', 'duration')
    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("🛠️ Tables synced successfully (with alter: true).");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to MySQL:", err);
  });

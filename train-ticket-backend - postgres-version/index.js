const express = require("express");
const cors = require("cors");
const db = require("./middleware/models");              // ✅ Sequelize instance with registered models
require("dotenv").config();                             // ✅ Load environment variables from .env
const morgan = require("morgan");
const logger = require("./utils/logger");
const requestLogger = require("./controllers/requestLogger");

const app = express();
const PORT = process.env.PORT; // ✅ Required for Render (do not fallback to 8080)

// ✅ Log all incoming HTTP requests using custom logger
app.use(requestLogger);

// ✅ Pipe HTTP logs into Winston via Morgan
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan("combined", { stream }));

// ✅ Core middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Register route handlers
app.use("/api/auth", require("./routes/auth.routes"));           // Login / Signup
app.use("/api/test", require("./routes/test.routes"));           // Protected test
app.use("/api/trains", require("./routes/train.routes"));        // Train search
app.use("/api/stations", require("./routes/station.routes"));    // Station list
app.use("/api/dev", require("./routes/dev.routes"));             // Developer utilities
app.use("/api/bookings", require("./routes/booking.routes"));    // Booking management

// ✅ Connect to Supabase PostgreSQL
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully.");

    // ⚠️ Optional: Enable only if using Sequelize migrations for schema control
    // return db.sequelize.sync({ alter: true });

    console.log("🛠️ Skipping model sync. Using Supabase-managed schema.");

    // ✅ Start server - Bind to 0.0.0.0 for Render compatibility
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to PostgreSQL:", err);
  });

// ✅ Core dependencies
const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

// ✅ Database (Sequelize models)
const db = require("./middleware/models");

// ✅ Logging tools
const morgan = require("morgan");
const logger = require("./utils/logger");                  // Custom Winston logger
const requestLogger = require("./controllers/requestLogger"); // Custom middleware logger

const app = express();
const PORT = process.env.PORT; // ⚠️ Do NOT fallback to 8080 — Render assigns dynamic port

// ✅ Log all incoming requests using custom middleware
app.use(requestLogger);

// ✅ HTTP logging (Morgan piped to Winston)
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan("combined", { stream }));

// ✅ Global middleware
app.use(cors());                                 // Enable cross-origin access
app.use(express.json());                         // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ✅ Health check endpoint (basic test)
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Register API routes
app.use("/api/auth", require("./routes/auth.routes"));         // 🔐 Login / Signup / Reset
app.use("/api/test", require("./routes/test.routes"));         // 🔒 Protected test route
app.use("/api/trains", require("./routes/train.routes"));      // 🚆 Train search APIs
app.use("/api/stations", require("./routes/station.routes"));  // 🏢 Stations list
app.use("/api/dev", require("./routes/dev.routes"));           // 🛠️ Dev/admin utilities
app.use("/api/bookings", require("./routes/booking.routes"));  // 🎟️ Ticket booking logic

// ✅ Connect to PostgreSQL via Supabase (with optional delay)
setTimeout(() => {
  db.sequelize.authenticate()
    .then(() => {
      console.log("✅ PostgreSQL connected successfully.");

      // ⚠️ Avoid syncing unless you're controlling schema via Sequelize
      // return db.sequelize.sync({ alter: true });

      console.log("🛠️ Skipping model sync. Using Supabase-managed schema.");

      // ✅ Start Express server — bind to 0.0.0.0 for Render hosting
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("❌ Unable to connect to PostgreSQL:", err);
    });
}, 3000); // ⏳ 3-second delay to avoid cold-start issues with Supabase

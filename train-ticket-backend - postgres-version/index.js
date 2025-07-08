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
const PORT = process.env.PORT || 3000; // ✅ Fallback only for local dev

// ✅ Middleware: Log all incoming requests
app.use(requestLogger);

// ✅ HTTP logging (Morgan piped to Winston)
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// ✅ Global middleware
app.use(cors());                                 // Enable cross-origin access
app.use(express.json());                         // Parse JSON body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// ✅ Health check
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Register routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/trains", require("./routes/train.routes"));
app.use("/api/stations", require("./routes/station.routes"));
app.use("/api/dev", require("./routes/dev.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));

// ✅ Connect to PostgreSQL (Supabase)
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully.");

    // 🚫 Skipping Sequelize sync since Supabase manages schema
    console.log("🛠️ Skipping model sync. Using Supabase-managed schema.");

    // ✅ Start server only in local or hosted environments
    if (process.env.NODE_ENV !== "vercel") {
      app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ Unable to connect to PostgreSQL:", err);
  });

// ✅ For Vercel: export the app
module.exports = app;

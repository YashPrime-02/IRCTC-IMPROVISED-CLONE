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
const PORT = process.env.PORT || 3000; // ✅ Render injects PORT

// ✅ Middleware: Log all incoming requests
app.use(requestLogger);

// ✅ HTTP logging (Morgan piped to Winston)
app.use(morgan("combined", {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

// ✅ Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ API routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/trains", require("./routes/train.routes"));
app.use("/api/stations", require("./routes/station.routes"));
app.use("/api/dev", require("./routes/dev.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));

// ✅ PostgreSQL connection (Supabase)
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connected successfully.");
    console.log("🛠️ Skipping model sync. Using Supabase-managed schema.");

    // ✅ Start server on Render, Railway, or local (not Vercel)
    if (process.env.NODE_ENV !== "vercel") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("❌ Unable to connect to PostgreSQL:", err);
  });

// ✅ For Vercel: export the app
module.exports = app;

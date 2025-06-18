const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize instance
require("dotenv").config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 8080;

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

// ✅ Connect and sync DB
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully.");
    return db.sequelize.sync(); // Sync all models
  })
  .then(() => {
    console.log("🛠️ Tables synced successfully.");
    // Start server only after successful DB sync
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to MySQL:", err);
  });

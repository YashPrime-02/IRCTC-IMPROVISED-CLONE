const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize instance from models/index.js
require("dotenv").config(); // Load .env variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests

// Root route (test purpose)
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// Auth Routes (Signup/Login)
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

// ✅ Test Protected Route
const testRoutes = require("./routes/test.routes");
app.use("/api/test", testRoutes);

// Connect to DB and sync
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully.");

    db.sequelize.sync().then(() => {
      console.log("🛠️ Tables synced successfully.");
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to MySQL:", err);
  });

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

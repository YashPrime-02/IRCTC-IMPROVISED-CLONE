const express = require("express");
const cors = require("cors");
const db = require("./models"); // Sequelize instance from models/index.js
require("dotenv").config(); // Load .env variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Root route (test purpose)
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// Sequelize Connection Test
db.sequelize.authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully.");
  })
  .catch(err => {
    console.error("❌ Unable to connect to MySQL:", err);
  });

// Define the port
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

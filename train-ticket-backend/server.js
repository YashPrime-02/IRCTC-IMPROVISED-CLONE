const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware setup
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse incoming JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Register API routes
require("./routes/station.routes")(app); // Routes to fetch station data
require("./routes/train.routes")(app);   // Routes for train search

// Root route - health check
app.get("/", (req, res) => {
  res.send("🚆 IRCTC Backend API Running!");
});

// Connect to MySQL DB (sync without forcing)
db.sequelize.sync().then(() => {
  console.log("✅ Connected to MySQL DB.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

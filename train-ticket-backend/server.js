const express = require("express");
const cors = require("cors");
const db = require("./models");

const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
require("./routes/station.routes")(app);
require("./routes/train.routes")(app);

// Root Route
app.get("/", (req, res) => {
  res.send("🚆 IRCTC Backend API Running!");
});

// DB Sync (Optional here, already done in seed.js)
db.sequelize.sync().then(() => {
  console.log("✅ Connected to MySQL DB.");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

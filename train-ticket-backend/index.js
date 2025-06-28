require("dotenv").config(); // Load env variables first

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./utils/logger");
const db = require("./middleware/models"); // Sequelize setup
const requestLogger = require("./controllers/requestLogger");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Logging: Winston + Morgan combined
const stream = {
  write: (message) => logger.http(message.trim()),
};
app.use(morgan("combined", { stream }));
app.use(requestLogger);

// ✅ Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Root health route
app.get("/", (req, res) => {
  res.send("🚄 IRCTC Clone Backend is Running!");
});

// ✅ Main routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/test", require("./routes/test.routes"));
app.use("/api/trains", require("./routes/train.routes"));
app.use("/api/stations", require("./routes/station.routes"));
app.use("/api/dev", require("./routes/dev.routes"));
app.use("/api/bookings", require("./routes/booking.routes"));

// ✅ DB Connection + Table Sync
const isDev = process.env.NODE_ENV !== "production";

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ MySQL connected successfully.");

    // Use alter: true only in dev (not in production)
    return db.sequelize.sync({ alter: isDev });
  })
  .then(() => {
    console.log("🛠️ Tables synced successfully.");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Unable to connect to MySQL:", err);
  });

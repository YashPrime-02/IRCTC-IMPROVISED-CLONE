// ✅ Load DB configuration
const dbConfig = require("../../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// ✅ Initialize Sequelize instance with PostgreSQL credentials from env
const sequelize = new Sequelize(
  dbConfig.DB,          // Database name
  dbConfig.USER,        // Database user
  dbConfig.PASSWORD,    // Database password
  {
    host: dbConfig.HOST,   // Hostname (Supabase: ends with `.supabase.co`)
    port: dbConfig.PORT,   // Port (default PostgreSQL: 5432)
    dialect: dbConfig.dialect, // Should be 'postgres' for Supabase
    logging: false          // Disable SQL query logging
  }
);

// ✅ Master DB object container
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register all Sequelize models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.stations = require("./station.model.js")(sequelize, DataTypes);
db.trains = require("./train.model.js")(sequelize, DataTypes);
db.bookings = require("./booking.model.js")(sequelize, DataTypes);
db.otps = require("./otp.model.js")(sequelize, DataTypes); // Optional OTP model

// ✅ Define associations here if needed
// Example: db.trains.belongsTo(db.stations, { foreignKey: 'sourceCode', targetKey: 'stationCode' });

module.exports = db;

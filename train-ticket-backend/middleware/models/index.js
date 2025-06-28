const dbConfig = require("../../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// ✅ Initialize Sequelize using field-based .env config
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD.replace(/"/g, ""), // Removes quotes if included in .env
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
    pool: dbConfig.pool,
  }
);

// ✅ Master DB object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.stations = require("./station.model.js")(sequelize, DataTypes);
db.trains = require("./train.model.js")(sequelize, DataTypes);
db.bookings = require("./booking.model.js")(sequelize, DataTypes);
db.otps = require("./otp.model.js")(sequelize, DataTypes);

// Optional: Define relationships here
// db.trains.belongsTo(db.stations, { foreignKey: 'sourceCode', targetKey: 'stationCode' });

module.exports = db;

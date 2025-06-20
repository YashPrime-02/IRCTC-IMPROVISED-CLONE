const dbConfig = require("../../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// Sequelize instance
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false,
  }
);

// Master DB object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Register all models
db.users = require("./user.model.js")(sequelize, DataTypes);
db.stations = require("./station.model.js")(sequelize, DataTypes);
db.trains = require("./train.model.js")(sequelize, DataTypes);
db.bookings = require("./booking.model.js")(sequelize, DataTypes);
db.otps = require("./otp.model.js")(sequelize, DataTypes);

// Associations (optional examples)
// db.trains.belongsTo(db.stations, { foreignKey: 'sourceCode', targetKey: 'stationCode' });

module.exports = db;

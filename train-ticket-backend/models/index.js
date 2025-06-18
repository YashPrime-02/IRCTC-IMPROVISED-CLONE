const dbConfig = require("../config/db.config.js");
const { Sequelize, DataTypes } = require("sequelize");

// ✅ Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    logging: false, // Disable logging
  }
);

// ✅ Initialize DB object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register all models
db.users = require("./user.model")(sequelize, DataTypes);
db.stations = require("./station.model")(sequelize, DataTypes);
db.trains = require("./train.model")(sequelize, DataTypes);

// 🔗 Optional: Define model relationships/associations here if needed

// ✅ Export the db object
module.exports = db;

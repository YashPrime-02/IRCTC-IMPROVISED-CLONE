const dbConfig = require("../config/db.config.js");
const { Sequelize } = require("sequelize");

// Create Sequelize instance
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false
  }
);

// Initialize db object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register user model correctly (note the plural "users")
db.users = require("./user.model")(sequelize, Sequelize.DataTypes);

// Export the db object
module.exports = db;

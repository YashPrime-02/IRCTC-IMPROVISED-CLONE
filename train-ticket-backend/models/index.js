const dbConfig = require("../config/db.config.js");
const { Sequelize } = require("sequelize");

// Create Sequelize instance with MySQL connection
const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    dialect: dbConfig.dialect,
    logging: false // Set to true to enable SQL query logs
  }
);

// Initialize db object to store Sequelize and models
const db = {};

db.Sequelize = Sequelize;   // Sequelize class (for operators, etc.)
db.sequelize = sequelize;   // Sequelize instance (connected to DB)

// 🔧 Models will be added here later, like:
// db.user = require("./user.model")(sequelize, Sequelize.DataTypes);

module.exports = db;

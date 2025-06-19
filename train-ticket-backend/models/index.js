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
    logging: false, // Disable SQL query logs
  }
);

// ✅ Initialize DB object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ✅ Register Models
db.users = require("./user.model")(sequelize, DataTypes);
db.stations = require("./station.model")(sequelize, DataTypes);
db.trains = require("./train.model")(sequelize, DataTypes);

db.bookings = require('./booking.model')(sequelize, DataTypes);


// 🔗 (Optional) Define Associations if needed later
// Example: 
// db.trains.belongsTo(db.stations, { foreignKey: 'sourceCode', targetKey: 'stationCode' });
// db.trains.belongsTo(db.stations, { foreignKey: 'destinationCode', targetKey: 'stationCode' });

// ✅ Export db object
module.exports = db;

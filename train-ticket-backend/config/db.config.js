require('dotenv').config(); // Optional if not already included in index.js

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  PORT: process.env.DB_PORT || 3306,
  dialect: "mysql", // Let Sequelize know we're using MySQL

  pool: {
    max: 10,           
    min: 0,            // Minimum number of connections Sequelize will keep
    acquire: 30000,    // The maximum time Sequelize will try to get a connection before throwing error (in ms)
    idle: 10000        // How long a connection can be idle before being released (in ms)
  }
};

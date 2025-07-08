// ✅ Load environment variables from .env file
require('dotenv').config();

module.exports = {
  // 🔌 PostgreSQL connection credentials from environment variables
  HOST: process.env.DB_HOST,       // Supabase host (e.g., db.xyz.supabase.co)
  USER: process.env.DB_USER,       // Supabase user
  PASSWORD: process.env.DB_PASSWORD, // Supabase password
  DB: process.env.DB_NAME,         // Supabase database name
  PORT: process.env.DB_PORT || 5432, // PostgreSQL default port

  // ✅ Specify the SQL dialect for Sequelize
  dialect: "postgres", // Switched from 'mysql' to 'postgres' for Supabase

  // 🧠 Connection pooling options
  pool: {
    max: 10,            // Max number of connections Sequelize can use at once
    min: 0,             // Minimum number of idle connections Sequelize maintains
    acquire: 30000,     // Max time (ms) Sequelize will wait for a connection before throwing error
    idle: 10000         // Time (ms) a connection must be idle before being released
  }
};

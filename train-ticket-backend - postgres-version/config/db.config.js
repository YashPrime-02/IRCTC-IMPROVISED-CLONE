// ✅ Load environment variables from .env file
require('dotenv').config();

module.exports = {
  // 🔌 PostgreSQL connection credentials from environment variables
  HOST: process.env.DB_HOST,            // Supabase DB host (e.g., xyz.supabase.co)
  USER: process.env.DB_USER,            // Supabase user (usually 'postgres')
  PASSWORD: process.env.DB_PASSWORD,    // Supabase password
  DB: process.env.DB_NAME,              // Supabase DB name (usually 'postgres')
  PORT: process.env.DB_PORT || 5432,    // PostgreSQL port (Render = 6543)

  // ✅ SQL dialect for Supabase (PostgreSQL)
  dialect: "postgres",

  // 🔐 Enable SSL for Supabase
  dialectOptions: {
    ssl: {
      require: true,                    // Require SSL (Supabase needs this)
      rejectUnauthorized: false        // Accept self-signed certificates
    }
  },

  // 🧠 Connection pooling options
  pool: {
    max: 10,                            // Max connections Sequelize can keep
    min: 0,                             // Min idle connections
    acquire: 30000,                     // Max time (ms) to get a connection before throwing error
    idle: 10000                         // Time (ms) before idle connection is released
  }
};

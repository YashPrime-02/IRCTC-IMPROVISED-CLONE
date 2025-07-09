// ✅ Load environment variables from .env file
require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST,             // 🟢 Pooler host (IPv4 compatible)
  USER: process.env.DB_USER,             // 👤 Supabase user with project ref
  PASSWORD: process.env.DB_PASSWORD,     // 🔐 Supabase password
  DB: process.env.DB_NAME,               // 🛢 DB name (usually 'postgres')
  PORT: parseInt(process.env.DB_PORT) || 5432, // 🌐 Default PostgreSQL port

  dialect: "postgres",                   // 🗄 PostgreSQL dialect for Sequelize

  dialectOptions: {
    ssl: {
      require: true,                     // 🔒 Enforce SSL for Render-Supabase connection
      rejectUnauthorized: false          // ⚠️ Allow self-signed Supabase certs
    }
  },

  // 🔁 Sequelize connection pool config
  pool: {
    max: 10,                             // Max connections in pool
    min: 0,                              // Min idle connections
    acquire: 30000,                      // Max time (ms) Sequelize tries to get connection
    idle: 10000                          // Max time (ms) a connection can be idle
  }
};

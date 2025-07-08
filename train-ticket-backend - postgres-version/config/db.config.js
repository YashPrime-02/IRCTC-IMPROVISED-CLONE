// ✅ Load environment variables from .env file
require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST,            // 🔌 Supabase DB host
  USER: process.env.DB_USER,            // 👤 Supabase user
  PASSWORD: process.env.DB_PASSWORD,    // 🔑 Password
  DB: process.env.DB_NAME,              // 🛢 DB name
  PORT: process.env.DB_PORT || 5432,    // 🌐 PostgreSQL external port

  dialect: "postgres",                  // 🗄 SQL dialect
  dialectOptions: {
    ssl: {
      require: true,                    // ✅ SSL required by Supabase
      rejectUnauthorized: false         // ⚠️ Allow self-signed certs (Vercel/Supabase)
    }
  },

  // 🧠 Sequelize connection pool
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

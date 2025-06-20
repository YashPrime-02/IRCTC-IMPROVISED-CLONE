// config/nodemailer.js

require('dotenv').config(); // ✅ Load .env first

const nodemailer = require('nodemailer');

console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "Exists" : "❌ Missing");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;

# 🚀 IRCTC Booking Clone (Node.js + MySQL Backend)

This is the backend service for the IRCTC Angular-based clone. It provides secure user authentication, booking management, and ticket data APIs powered by Express.js and MySQL using Sequelize ORM.

---

## 🌐 Features (Backend)

- 🔐 User Authentication (Signup, Login)
  - Hashed passwords using bcrypt
  - JWT-based session tokens
  - Protected routes with middleware

- 📅 Train Data API (CRUD)
  - Serve trains for search results
  - Filter based on date, route, and train ID

- 🎟 Booking Management
  - Create new bookings linked to users and trains
  - Store passenger details
  - Generate unique PNRs
  - Send confirmation emails (via **NodeMailer**)
  - Generate and return QR codes for tickets

- 🧾 Booking History
  - Retrieve all past bookings for a user

---

## 🛠 Tech Stack

- **Node.js** + **Express.js**
- **MySQL** (hosted on Railway)
- **Sequelize ORM**
- **bcryptjs**, **jsonwebtoken**, **nodemailer**, **qrcode**
- **dotenv**, **cors**, **helmet**

---

## 📁 Project Structure

```bash
train-ticket-backend/
├── config/             # DB & Email config
├── controllers/        # Route logic
├── models/             # Sequelize models
├── routes/             # API route definitions
├── middleware/         # Auth check, error handlers
├── utils/              # QR, PDF helpers
├── .env
├── index.js
└── package.json

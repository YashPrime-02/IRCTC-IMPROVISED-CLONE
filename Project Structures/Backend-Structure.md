# 📦 IRCTC Booking Clone – Full Project Structure (Backend)


## 🖥️ Backend (Node.js + Express + Sequelize + MySQL)
Location: `/backend/`

```
backend/
├── config/
│   └── db.config.js
├── controllers/
│   ├── auth.controller.js
│   └── booking.controller.js
├── middleware/
│   └── verifyToken.js
├── models/
│   ├── index.js
│   ├── user.model.js
│   └── booking.model.js
├── routes/
│   ├── auth.routes.js
│   └── booking.routes.js
├── utils/
│   └── generatePNR.js
├── .env
├── index.js
└── package.json
```

### Key Features

- ✅ **Signup/Login**: Secure bcrypt password storage + JWT token generation
- 🔒 **Auth Middleware**: Protect routes with token validation
- 📝 **Bookings API**: `/api/bookings` with user-specific filtering
- 📂 **Models**:
  - `User`: name, email, password
  - `Booking`: trainName, passengers, totalFare, etc.
- 🌐 **CORS** enabled for Angular frontend
- 🐘 **Database**: MySQL (Railway.app or local), Sequelize ORM for migrations

---

## 🛠️ Additional Integrations

- `html2pdf.js`: Ticket to downloadable PDF (frontend)
- `QRCode.js`: Generate QR Code from ticket info
- `EmailJS`: Send ticket via email (can be replaced with Nodemailer in backend)
- `localStorage` / `sessionStorage`: Session + booking flow persistence

---

✅ **Fully responsive** (Mobile, Tablet, Desktop)  
✅ **Clean modular structure**  
✅ **Session safety + UX fallback for invalid users**  
✅ **Toast and modal feedback across app**

---

🛤️ *Happy Coding!* — *Built with ❤️ by Yash Mishra*

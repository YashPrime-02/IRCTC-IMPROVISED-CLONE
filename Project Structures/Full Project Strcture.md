
# 📦 IRCTC Booking Clone – Full Project Structure (Frontend + Backend)

---

## 🌐 Frontend (Angular 17+)
Location: `/src/app/`

```
src/app/
├── auth/
│   ├── login/
│   ├── signup/
│   └── auth.service.ts
├── header/
│   └── header.component.{ts,html,css}
├── booking/
│   ├── booking.component.{ts,html,css}
├── train-search/
│   └── train-search.component.{ts,html,css}
├── ticket-view/
│   └── ticket-view.component.{ts,html,css}
├── booking-history/
│   └── booking-history.component.{ts,html,css}
├── shared/
│   ├── models/
│   └── services/
│       └── train.service.ts
├── app-routing.module.ts
├── app.component.ts
└── app.module.ts
```

### Key Features

- 🔐 **Auth**: Login, Signup, JWT token storage (`localStorage`), session validity check
- 🚆 **Train Search**: Source/Destination with swap feature, animation & filters
- 📄 **Booking**: Dynamic passengers (1-7), seat type, fare calculation, RAC/WL logic
- 🕐 **Timeout**: 9-min timer with warning animation and logout modal on expiry
- 📧 **EmailJS** (or NodeMailer): Ticket confirmation email with QR Code & PDF
- 📜 **Booking History**: Fetch history based on user email (secured)
- ⚠️ **Error Handling**: Toast notifications, form validation, modal fallback

---

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

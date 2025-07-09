# 📦 IRCTC Booking Clone – Full Project Structure (Backend)


## 🖥️ Backend (Node.js + Express + Sequelize + MySQL)
Location: `/train-ticket-backend-postgres-version`

```
train-ticket-backend-postgres-version/
│
├── config/
│   ├── db.config.js              # Sequelize DB config (if used)
│   └── node.mailer.js            # NodeMailer config (if used)
│
├── controllers/                 # (Optional: Controller logic)
│
├── data/                        # Static data, seed files
│
├── logs/                        # App logs (if using logging middleware)
│
├── middleware/                  # Express middleware (auth, error, logger)
│
├── node_modules/
│
├── routes/
│   ├── auth.routes.js           # Auth/signup/login routes
│   ├── booking.routes.js        # Booking creation & management
│   ├── dev.routes.js            # Dev-only: ping, user CRUD, cron testing
│   ├── station.routes.js        # Station list, autocomplete, etc.
│   ├── test.routes.js           # (Optional) Unit test routes
│   └── train.routes.js          # Train search, availability, details
│
├── utils/
│   ├── logger.js                # Custom logger (optional)
│   └── supabaseClient.js        # ✅ Supabase client (ADMIN KEY based)
│
├── .env                         # ✅ Env vars (Supabase, ports, secrets)
├── db.json                      # (Optional) for older JSON DB mock
├── index.js                     # ✅ Main entry point (Express + Routes)
├── package.json
├── package-lock.json
├── seed.js                      # (Optional) Initial data population script
└── vercel.json / render.yaml    # (Optional) for hosting


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

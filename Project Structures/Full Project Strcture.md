
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

# 📦 IRCTC Booking Clone – Full Project Structure (Backend)
🔁 This project has two versions of the backend:

✅ Primary: PostgreSQL + Supabase (latest, production-ready)

🗃️ Legacy (optional): MySQL + Sequelize version

-------------------------------------------------------------------------------------------------------------------------

## 🖥️ Backend (Node.js + Express + Sequelize + Postgres SQL)
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

-------------------------------------------------------------------------------------------------------------------------



## 🖥️ Backend (Node.js + Express + Sequelize + MY SQL)
Location: `/train-ticket-backend`

---


train-ticket-backend/
│
├── config/
│   ├── db.config.js              # MySQL connection config
│   └── node.mailer.js            # NodeMailer config (if needed)
│
├── controllers/
│   ├── auth.controller.js
│   └── booking.controller.js
│
├── middleware/
│   ├── auth.middleware.js
│   └── errorHandler.js
│
├── models/
│   ├── index.js                  # Sequelize init
│   ├── user.model.js
│   └── booking.model.js
│
├── routes/
│   ├── auth.routes.js
│   ├── booking.routes.js
│   └── train.routes.js
│
├── utils/
│   └── logger.js
│
├── .env
├── index.js
├── package.json
└── seed.js

🛤️ *Happy Coding!* — *Built with ❤️ by Yash Mishra*

-------------------------------------------------------------------------------------------------------------------------
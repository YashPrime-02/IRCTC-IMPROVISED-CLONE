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
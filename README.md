
---

## ✅ **Frontend +Backend README (`/train-ticket-frontend/README.md`)**

```markdown
# 🚆 IRCTC Clone Frontend – Angular 17+

This is the frontend application for the IRCTC booking system. It supports dynamic train search, booking, countdowns, ticket view with QR and PDF support, and booking history.

---

## 📁 Key Components

- `auth/` → Login, Signup with localStorage support
- `train-search/` → Station swap, train list filters
- `booking/` → Animated passenger form, countdown, toast alerts
- `ticket-view/` → Ticket confirmation, QR + PDF, email trigger
- `booking-history/` → Filterable booking history cards
- `services/` → BookingService for backend API communication

---

## ⚙️ Setup

```bash
cd train-ticket-frontend
npm install
ng serve

App will run at http://localhost:4200/


📂 Environment Setup
Create .env (optional for EmailJS config):

env
Copy
Edit
EMAIL_SERVICE_ID=service_id
EMAIL_TEMPLATE_ID=template_id
EMAIL_PUBLIC_KEY=public_key
These are injected into the ticket-view component for email confirmations.

📦 Tools & Libraries
Bootstrap 5 (responsive design)

html2pdf.js (PDF generation)

EmailJS (for sending email with QR)

QR Code Generator (Angular QR)

LocalStorage & SessionStorage




---

## ✅ **Backend README (`/train-ticket-backend/README.md`)**

```markdown
# 🧠 IRCTC Clone Backend – Node.js + MySQL

This is the backend API for the IRCTC Clone Booking System. Built using Express, Sequelize ORM, and JWT-based auth.

---

## 🔧 Technologies Used

- Express.js
- Sequelize ORM
- MySQL
- JWT Auth
- CORS, bcrypt
- RESTful APIs

---

## 🔌 API Endpoints

### Auth Routes

| Method | Route          | Description        |
|--------|----------------|--------------------|
| POST   | `/api/auth/signup` | Register user |
| POST   | `/api/auth/login`  | Login user    |

### Booking Routes

| Method | Route                    | Description              |
|--------|--------------------------|--------------------------|
| POST   | `/api/bookings`          | Save a new booking       |
| GET    | `/api/bookings?email=..` | Fetch bookings by email  |
| DELETE | `/api/bookings/:id`      | Delete booking by ID     |

### Train & Station Routes

| Method | Route             | Description               |
|--------|-------------------|---------------------------|
| GET    | `/api/trains`     | Get all train records     |
| GET    | `/api/stations`   | Get all station records   |

---

## 🧪 Setup Instructions

1. Create `.env` file

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=irctc_clone
JWT_SECRET=mysecret


Run Backend:

bash
Copy
Edit
npm install
npm start
Backend runs at: http://localhost:8080


📄 Models
User
name, email, password

Booking
trainName, sourceCode, destinationCode

email, passengers (JSON), totalAmount

date, duration, bookingDate

🛡️ Security
Passwords hashed with bcrypt

JWT-based login system

All input validated before DB write

# 🚄 IRCTC Improvised Clone

A **Full-Stack Train Ticket Booking Application** inspired by IRCTC — built with **Angular**, **Node.js**, **Express.js**, **Sequelize**, and **MySQL**. This clone features real-time train search, animated booking flows, email confirmations, and downloadable tickets — all secured with JWT and built for modern responsiveness.

> ✨ Real Trains. Real UX. Developer Friendly. 🚉

---

## 🔗 Live Links

- 📂 **GitHub Repository**: [YashPrime-02/IRCTC-IMPROVISED-CLONE](https://github.com/YashPrime-02/IRCTC-IMPROVISED-CLONE)
- 🌐 **Frontend Deployment**: _Coming Soon..._
- ⚙️ **Backend API Base URL**: `http://localhost:3000/api`

---

## 🧠 Project Highlights

- 🔐 **Secure Auth**: Login, Signup, Forgot Password (JWT-based)
- 🚉 **Train Search**: Source–Destination filter with swap animation
- ⏱️ **Booking Timer**: 9-minute session limit with warning sound
- 👥 **Dynamic Passengers**: Add/Remove up to 7 with animation
- 📩 **Email Confirmation**: Booking email via EmailJS with QR
- 📄 **PDF Ticket Download**: Export ticket with `html2pdf.js`
- 📲 **Web Share API**: Share ticket on WhatsApp/Email
- 🧬 **Seed Script**: Preloads train and station data

---

## 🧩 Tech Stack

### 💻 Frontend
- Angular 17+
- Bootstrap Grid
- EmailJS, QRCode.js, html2pdf.js
- SCSS (with Inter & Poppins fonts)

### 🛠️ Backend
- Node.js + Express.js
- Sequelize ORM + MySQL
- Nodemailer, JWT, Bcrypt
- Helmet, CORS, dotenv

---

## 📁 Folder Structure

### `/irctc-frontend`
src/
├── app/
│ ├── auth/ # Login, Signup, Forgot Password
│ ├── train-search/ # Search trains with swap and filters
│ ├── booking/ # Passenger form, countdown, validation
│ ├── ticket-view/ # Ticket summary, PDF, QR code
│ └── shared/ # Guards, models, services
├── assets/ # Audio (timer), fonts, images
├── styles.scss # Global styling

shell
Copy
Edit

### `/train-ticket-backend`
train-ticket-backend/
├── config/ # DB & nodemailer setup
├── controllers/ # All route logic
├── data/ # stations.json
├── middleware/ # JWT verification
├── models/ # Sequelize schema definitions
├── routes/ # Modular routes
├── seed.js # Seeder for trains & stations
├── package.json

yaml
Copy
Edit

---

## 🚀 Getting Started

### 🔧 Clone & Install

```bash
git clone https://github.com/YashPrime-02/IRCTC-IMPROVISED-CLONE.git
📦 Backend Setup
bash
Copy
Edit
cd train-ticket-backend
npm install
# Add .env file manually
node seed.js
npm start
🎨 Frontend Setup
bash
Copy
Edit
cd irctc-frontend
npm install
ng serve
🔌 API Endpoints
Method	Endpoint	Purpose
POST	/api/auth/signup	Register user
POST	/api/auth/login	Login & get token
POST	/api/booking	Book a train ticket
GET	/api/trains	Get all train routes
GET	/api/stations	Fetch station list
POST	/api/otp/verify	Verify OTP from email
POST	/api/password-reset	Initiate password reset

📸 Key UI Features
✅ Clean, animated login/signup

🔄 Swap button with animation on train search

⏱️ 9-minute booking countdown with auto logout + sound

👤 Add/Remove passengers dynamically (max: 7)

📩 Booking confirmation via email (with QR)

📄 Export ticket as PDF

📲 Share ticket via Web Share API

✅ Completed Milestones
 JWT-based auth and session storage

 Booking form with dynamic passengers

 QR + Email confirmation via EmailJS

 PDF generation using html2pdf.js

 Web Share API Integration

 Seeder for train & station data

🧑‍💻 Author
Yash Mishra
📍 India
🔗 LinkedIn
🔗 GitHub

📄 License
This project is licensed under the MIT License.
This is a personal project built for learning and demonstration. It is not affiliated with IRCTC or Indian Railways.


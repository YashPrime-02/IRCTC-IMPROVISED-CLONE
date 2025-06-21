IRCTC Improvised Clone – Project README
A Full-Stack Train Ticket Booking Application inspired by IRCTC — built with Angular, Node.js, Express.js, Sequelize, and MySQL. This project replicates real-world booking workflows with a modern UI, QR-based ticketing, and secure backend APIs.
🔗 GitHub Repository: https://github.com/YashPrime-02/IRCTC-IMPROVISED-CLONE
🌐 Frontend Hosting: Coming Soon
⚙️ Backend API: Locally on http://localhost:3000/api
🧠 Highlights
•	🔐 JWT-secured Login, Signup & Password Reset
•	🚉 Dynamic Train Search with Swap & Timed Session (9 min)
•	🧾 Passenger Management with Real-Time Form Validation
•	📩 Email Confirmation via EmailJS (with QR Code)
•	📄 PDF Ticket Download using html2pdf.js
•	📲 Share via WhatsApp / Email (Web Share API)
•	🎛️ Admin Seeder for Stations & Trains
•	🔄 Clean API with Modular Architecture (Node + Sequelize)
🧩 Tech Stack
💻 Frontend: Angular 17+, Bootstrap Grid, EmailJS, QRCode.js, html2pdf.js, Custom SCSS
🛠️ Backend: Node.js, Express.js, Sequelize ORM, MySQL, Nodemailer, JWT, Bcrypt, dotenv
📁 Folder Structure
Frontend (/irctc-frontend):
•	app/auth/ - Login, Signup, Forgot Password
•	app/train-search/ - Train results, swap, filters
•	app/booking/ - Form, countdown, animation
•	app/ticket-view/ - QR, PDF, share
•	shared/ - Services, models, guards
•	assets/ - Fonts, sounds, images
•	styles.scss - Global theme
Backend (/train-ticket-backend):
•	config/ - DB & Mail config
•	controllers/ - All core logic handlers
•	data/ - stations.json
•	middleware/ - verifyToken (JWT)
•	models/ - Sequelize models
•	routes/ - API endpoints
•	seed.js - Seeder script
•	.env - Env config (excluded)
•	package.json
🚀 Getting Started
1. Clone the repo:
  git clone https://github.com/YashPrime-02/IRCTC-IMPROVISED-CLONE.git
2. Backend Setup:
  cd train-ticket-backend
  npm install
  node seed.js
  npm start
3. Frontend Setup:
  cd irctc-frontend
  npm install
  ng serve
🔌 Key API Endpoints
•	POST /api/auth/signup - Register new user
•	POST /api/auth/login - Login with credentials
•	POST /api/booking - Book ticket
•	GET /api/trains - List available trains
•	GET /api/stations - Get station list
•	POST /api/otp/verify - OTP verification (email-based)
•	POST /api/password-reset - Initiate password reset
🧑💻 Author
Yash Mishra
📍 India
🔗 LinkedIn: https://www.linkedin.com/in/yash-mishra-dev/
🔗 GitHub: https://github.com/YashPrime-02
📄 License
This project is licensed under the MIT License. This is an unofficial educational project — no affiliation with IRCTC or Indian Railways.

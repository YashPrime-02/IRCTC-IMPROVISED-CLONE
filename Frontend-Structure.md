# 🚄 IRCTC Booking Clone (Angular Frontend)

A fully responsive and feature-rich IRCTC ticket booking web app built using Angular. The project simulates a real-world train booking flow including login/signup, ticket booking, passenger management, QR code generation, PDF export, and email confirmation using EmailJS.

---

## 🌟 Features Implemented

### 🔐 Authentication Module
- Login with validation and localStorage-based credential check.
- Signup with form validation (age, password rules, etc).
- AuthGuard for protected routes.
- Toast notifications for feedback (no alerts used).
- Forgot Password structure added (overlay in `AuthWrapper`).

### 🎫 Booking Flow
- Train Search Page (UI-only in current phase).
- Booking Component:
  - Dynamic passenger add/remove (1–7).
  - Inline form validation with field error messages.
  - Animated passenger cards.
  - Real-time total fare calculation.
  - Form submission stores data in `sessionStorage`.

### 🧾 Ticket Summary (`ticket-view`)
- Displays summary of booked ticket:
  - Train details, user info, total fare.
  - Passenger cards with seat allocation and booking status (Confirmed, RAC, Waiting).
  - Status badge styling.
- Dynamically generated **PNR number**.
- **QR Code** for ticket data.
- **Download PDF** functionality using `html2pdf.js`.
- Responsive toast message for copied PNR.

### 📧 Email Confirmation (via EmailJS)
- Sends email on booking confirmation.
- Email includes ticket details + QR Code image.

---

## 🛠️ Technologies Used

- **Angular** 17+ with Standalone Components
- **HTML/CSS** with responsive layout
- **Bootstrap Grid** + custom styling
- **EmailJS** (Public API Key)
- **QRCode** npm package
- **html2pdf.js** for PDF download
- **localStorage / sessionStorage** for data persistence

---

## 🧱 Project Structure (Frontend)

```bash
src/app/
│
├── auth/                          # Authentication related components & services
│   ├── login/                     # LoginComponent with password toggle feature
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   ├── login.component.css
│   ├── signup/                    # SignupComponent for user registration
│   │   ├── signup.component.ts
│   │   ├── signup.component.html
│   │   ├── signup.component.css
│   ├── auth-wrapper/              # Wrapper component handling login/signup toggling and forgot password overlay
│   │   ├── auth-wrapper.component.ts
│   │   ├── auth-wrapper.component.html
│   │   ├── auth-wrapper.component.css
│   ├── auth.service.ts            # Authentication service (handling login/signup, token mgmt)
│
├── train-search/                 # Train searching functionality
│   ├── train-search.component.ts
│   ├── train-search.component.html
│   ├── train-search.component.css
│   ├── train.model.ts             # Train data models/interfaces
│
├── booking/                      # Booking component & service
│   ├── booking.component.ts
│   ├── booking.component.html
│   ├── booking.component.css
│   ├── booking.service.ts
│   ├── booking.model.ts
│
├── ticket-view/                 # Ticket viewing component
│   ├── ticket-view.component.ts
│   ├── ticket-view.component.html
│   ├── ticket-view.component.css
│
├── shared/                      # Shared resources across app
│   ├── guards/                   # Route guards like AuthGuard
│   ├── interceptors/             # HTTP interceptors for auth tokens, error handling
│   ├── models/                   # Common interfaces and types
│   ├── pipes/                    # Custom Angular pipes
│   ├── services/                 # Shared services (e.g. toast notifications)
│
├── app-routing.module.ts        # Angular routing module (routes & lazy loading)
├── app.component.ts/html/css    # Root app component
├── app.module.ts                # Root Angular module

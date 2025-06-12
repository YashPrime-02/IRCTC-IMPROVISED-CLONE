src/app/
│
├── auth/ # Authentication related components & services
│ ├── login/ # LoginComponent with password toggle feature
│ │ ├── login.component.ts
│ │ ├── login.component.html
│ │ ├── login.component.css
│ ├── signup/ # SignupComponent for user registration
│ │ ├── signup.component.ts
│ │ ├── signup.component.html
│ │ ├── signup.component.css
│ ├── auth-wrapper/ # Wrapper component handling login/signup toggling and forgot password overlay
│ │ ├── auth-wrapper.component.ts
│ │ ├── auth-wrapper.component.html
│ │ ├── auth-wrapper.component.css
│ ├── auth.service.ts # Authentication service (handling login/signup API calls, token management)
│
├── train-search/ # Train searching functionality
│ ├── train-search.component.ts
│ ├── train-search.component.html
│ ├── train-search.component.css
│ ├── train.model.ts # Train data models/interfaces
│
├── booking/ # Booking component & service
│ ├── booking.component.ts
│ ├── booking.component.html
│ ├── booking.component.css
│ ├── booking.service.ts
│ ├── booking.model.ts
│
├── ticket-view/ # Ticket viewing component
│ ├── ticket-view.component.ts
│ ├── ticket-view.component.html
│ ├── ticket-view.component.css
│
├── shared/ # Shared resources across app
│ ├── guards/ # Route guards like AuthGuard
│ ├── interceptors/ # HTTP interceptors for auth tokens, error handling
│ ├── models/ # Common interfaces and types
│ ├── pipes/ # Custom Angular pipes
│ ├── services/ # Shared services (e.g. notifications)
│
├── app-routing.module.ts # Angular routing module (routes & lazy loading)
├── app.component.ts/.html/.css # Root app component
├── app.module.ts # Root Angular module

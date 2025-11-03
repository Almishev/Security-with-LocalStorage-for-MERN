# MERN Inventory App — Security with LocalStorage

This project is a minimal MERN application that demonstrates a pragmatic security approach based on storing a short‑lived JWT in the browser's LocalStorage. It includes protected API routes on the server, protected pages on the client, and a simple employee CRUD area plus an authenticated profile page.

> Focus: Security-with-LocalStorage-for-MERN

---

## Table of Contents
- Overview
- Security Model (LocalStorage)
- Architecture
- Installation
- Environment Variables
- Running the App
- API Endpoints
- Frontend Routes
- Folder Structure
- Trade‑offs vs. HttpOnly Cookies
- Hardening Checklist

---

## Overview
- Stack: MongoDB, Express, React (Vite), Node.js
- Auth: JWT (signed with `JWT_SECRET`) issued on Register/Login
- Token storage: LocalStorage (`token`)
- API protection: Bearer token in `Authorization` header, validated by Express middleware
- UI protection: ProtectedRoute component checks presence of token before rendering protected pages

---

## Security Model (LocalStorage)
- On successful registration or login, the server responds with a JWT.
- The client saves the token in LocalStorage (key: `token`).
- An Axios interceptor injects `Authorization: Bearer <token>` for protected requests.
- A response interceptor clears the token and redirects to `/login` on `401 Unauthorized`.
- The server authenticates requests via an Express middleware (`authenticateToken`) that validates the JWT and exposes `req.userId` to handlers.

Important: LocalStorage is convenient and persistent but susceptible to XSS. See the Hardening Checklist for mitigation steps and alternatives.

---

## Architecture
```
client/ (Vite + React)
  src/
    auth/        # Login / Register
    components/  # ProtectedRoute, etc.
    getEmployee/ # Employee list
    profile/     # /profile (protected)
    utils/       # axiosConfig + auth (LocalStorage helpers)

server/ (Express + Mongoose)
  auth/         # userModel, userController, middleware, userRoutes
  controller/   # employeeController
  routes/       # employeeRoute (all protected)
  model/        # employeeModel
```

---

## Installation
```bash
# Server
cd server
npm install

# Client
cd ../client/mern-crud-frontend
npm install
```

---

## Environment Variables
Create a `.env` file under `server/`:
```
PORT=8000
MONGO_URL=mongodb://localhost:27017/MERN_CRUD_WITH_AUTH
JWT_SECRET=replace_with_a_long_random_secret
```

Notes:
- Use a strong, random `JWT_SECRET`.
- Default client dev server runs on `5173` (Vite). CORS is configured to allow this origin.

---

## Running the App
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client/mern-crud-frontend
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:8000

---

## API Endpoints
Auth (public):
- `POST /api/auth/register` → { token, user }
- `POST /api/auth/login`    → { token, user }

Auth (protected):
- `GET  /api/auth/me` → current user profile (requires Bearer token)

Employees (all protected):
- `GET    /api/employees`
- `GET    /api/employees/:id`
- `POST   /api/employees`
- `PUT    /api/employees/:id`
- `DELETE /api/employees/:id`

Protection middleware: `server/auth/middleware.js` (`authenticateToken`).

---

## Frontend Routes
- `/login` (public)
- `/register` (public)
- `/employee` (protected)
- `/add` (protected)
- `/update/:id` (protected)
- `/profile` (protected, manual navigation allowed)

Route guard: `ProtectedRoute` uses LocalStorage token presence via `isAuthenticated()`.

Token helpers (LocalStorage): `client/.../src/utils/auth.js`:
- `setToken(token)`
- `getToken()`
- `removeToken()`
- `isAuthenticated()`

Axios config with interceptors: `client/.../src/utils/axiosConfig.js`.

---

## Folder Structure (excerpt)
```
mern/
├── server/
│   ├── auth/
│   │   ├── userController.js
│   │   ├── userModel.js
│   │   ├── userRoutes.js
│   │   └── middleware.js
│   ├── controller/employeeController.js
│   ├── routes/employeeRoute.js
│   └── model/employeeModel.js
└── client/mern-crud-frontend/
    └── src/
        ├── auth/
        ├── components/
        ├── getEmployee/
        ├── profile/
        └── utils/
```

---

## Trade‑offs vs. HttpOnly Cookies
**LocalStorage Pros:**
- Simple to implement; framework‑agnostic
- Persistent across tabs and refreshes

**LocalStorage Cons:**
- Vulnerable to XSS (token readable by JS)
- Requires manual CSRF handling if you adopt cookies later

**HttpOnly Cookies Pros:**
- Not readable by JS (mitigates token theft via XSS)
- Integrates naturally with CSRF protections and SameSite policies

**HttpOnly Cookies Cons:**
- More setup (cookie flags, CSRF strategy)
- More complex local/dev setup (origins, CORS, SameSite=None+Secure)

If you need stronger protections, migrate to HttpOnly cookies and add CSRF tokens or Double-Submit Cookie technique.

---

## Hardening Checklist
- Use strong Content Security Policy (CSP) to reduce XSS risk.
- Sanitize ALL user input rendered in the UI.
- Keep JWT short‑lived (e.g., 15–60 minutes) and consider refresh flow.
- Revoke/rotate JWT on logout or password change.
- Use HTTPS in production; set secure CORS and allowed origins.
- Validate and sanitize on the server (Mongoose schemas + explicit checks).
- Log and monitor auth errors; rate‑limit auth endpoints.

---

## License
MIT — Use at your own risk. Security posture depends on your deployment choices and adherence to best practices.

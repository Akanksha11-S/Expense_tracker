# Pocketbook – Expense Tracker

A full-stack expense tracker. Users sign up, log in, and manage their own expenses, with a category breakdown shown as a pie chart.

**Stack:** React (Vite) · Tailwind CSS · Chart.js · Node.js · Express · MongoDB (Mongoose) · JWT · bcrypt

## Features

- Sign up and log in with JWT authentication; passwords hashed with bcrypt (12 rounds)
- Add, view, edit and delete expenses (Category, Amount, Comments, Created At, Updated At)
- Table sorted by most recently added record
- Pie chart of spending by category, with a per-category breakdown
- Form validation on both client and server, protected API routes and pages, responsive layout
- Every expense is scoped to its owner; other users' records are never returned or editable

## Project structure

```
expense-tracker/
├── backend/
│   ├── server.js
│   ├── middleware/   auth.js, error.js
│   ├── models/       User.js, Expense.js
│   └── routes/       auth.js, expenses.js
└── frontend/
    └── src/
        ├── components/   Navbar, Modal, ExpenseForm, ExpenseTable, CategoryChart, ...
        ├── context/      AuthContext.jsx
        ├── pages/        Login, Signup, Dashboard
        └── utils/        api.js, format.js, categories.js
```

## Getting started

You need Node.js 18+ and a running MongoDB (local install or an Atlas connection string).

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

| Variable         | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `PORT`           | API port (default 5000)                              |
| `MONGO_URI`      | MongoDB connection string                            |
| `JWT_SECRET`     | Secret used to sign tokens. Use a long random string |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d`                            |
| `CLIENT_URL`     | Allowed frontend origin(s) for CORS, comma separated |

Generate a secret with: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173.

| Variable        | Purpose                                                   |
| --------------- | --------------------------------------------------------- |
| `VITE_API_URL`  | Base URL of the API (default `http://localhost:5000/api`) |
| `VITE_CURRENCY` | ISO currency code for display, e.g. `INR`, `USD`          |
| `VITE_LOCALE`   | Number/date locale, e.g. `en-IN`, `en-US`                 |

For production use `npm run build` and serve `frontend/dist`.

## API

All `/api/expenses` routes require the header `Authorization: Bearer <token>`.

| Method | Endpoint            | Description                                         |
| ------ | ------------------- | --------------------------------------------------- |
| POST   | `/api/auth/signup`  | Create an account, returns `{ token, user }`        |
| POST   | `/api/auth/login`   | Log in, returns `{ token, user }`                   |
| GET    | `/api/auth/me`      | Current user                                        |
| GET    | `/api/expenses`     | List your expenses, newest first                    |
| POST   | `/api/expenses`     | Create an expense `{ category, amount, comments? }` |
| PUT    | `/api/expenses/:id` | Update an expense                                   |
| DELETE | `/api/expenses/:id` | Delete an expense                                   |

Validation errors return `400` with `{ message, errors: { field: "reason" } }`.

## Notes

- The category list lives in `backend/models/Expense.js` and `frontend/src/utils/categories.js`. Change both together.
- The token is stored in `localStorage`. For a hardened production setup, consider httpOnly cookies.
- Login and sign-up endpoints are rate limited.

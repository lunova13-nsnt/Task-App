# TaskFlow — Mini SaaS Task Management System

A full-stack, production-ready task management application built with **React**, **Node.js/Express**, **PostgreSQL**, and **Sequelize**. Features secure JWT authentication and a fully private, per-user task system.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | PostgreSQL + Sequelize ORM |
| Auth | bcrypt (password hashing) + JWT |
| Validation | express-validator |

---

## Project Structure

```
Mini-SaaS-Task-App/
├── backend/
│   ├── config/
│   │   └── database.js          # Sequelize connection (local + cloud support)
│   ├── controllers/
│   │   ├── authController.js    # signup, login, getMe
│   │   └── taskController.js    # CRUD + stats
│   ├── middlewares/
│   │   ├── verifyToken.js       # JWT auth guard
│   │   └── errorHandler.js      # Central error + 404 handler
│   ├── models/
│   │   ├── index.js             # Associations (User hasMany Tasks)
│   │   ├── User.js              # id, name, email, password
│   │   └── Task.js              # id, title, description, status, priority, dueDate, userId
│   ├── routes/
│   │   ├── authRoutes.js        # POST /signup, POST /login, GET /me
│   │   └── taskRoutes.js        # Full CRUD — all protected
│   ├── .env.example
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── CreateTaskModal.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   ├── StatsBar.jsx
    │   │   └── TaskItem.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state + session restore
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   └── Dashboard.jsx
    │   ├── services/
    │   │   └── api.js            # Axios instance + auth/task API helpers
    │   ├── App.jsx               # Router setup
    │   ├── main.jsx
    │   └── index.css             # Tailwind + custom utilities
    ├── .env.example
    ├── tailwind.config.js
    └── vite.config.js            # Dev proxy → backend
```

---

## Running Locally

### Prerequisites

- Node.js v18+
- PostgreSQL installed and running
- Git

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/Mini-SaaS-Task-App.git
cd Mini-SaaS-Task-App
```

---

### Step 2 — Set up the Database

Open your PostgreSQL client (psql or pgAdmin) and create the database:

```sql
CREATE DATABASE mini_saas_tasks;
```

Sequelize will **auto-create the tables** when the server starts (`sync: { alter: true }`).

---

### Step 3 — Configure the Backend

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development

# Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini_saas_tasks
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# OR for cloud DBs (Supabase / Neon / Render):
# DATABASE_URL=postgresql://user:password@host:port/dbname

JWT_SECRET=your_super_secret_key_at_least_32_characters_long
JWT_EXPIRES_IN=7d
```

Install dependencies and start the backend:

```bash
npm install
npm run dev
```

You should see:
```
✅ PostgreSQL connected successfully.
✅ Database tables synced.
🚀 Server running on http://localhost:5000
```

---

### Step 4 — Configure the Frontend

Open a **new terminal**:

```bash
cd frontend
cp .env.example .env
```

The Vite dev server already proxies `/api` → `http://localhost:5000`, so the `.env` file can stay empty for local development.

Install dependencies and start:

```bash
npm install
npm run dev
```

App runs at: **http://localhost:5173**

---

## API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Protected | Get current user |

**Signup body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "Secret123"
}
```

**Login body:**
```json
{
  "email": "jane@example.com",
  "password": "Secret123"
}
```

Both return:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { "id": "uuid", "name": "Jane Smith", "email": "jane@example.com" }
}
```

---

### Task Endpoints (all require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks for logged-in user |
| GET | `/api/tasks?status=pending` | Filter by status |
| GET | `/api/tasks?search=keyword` | Search by title |
| GET | `/api/tasks/stats` | Get task count stats |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

**Create/Update task body:**
```json
{
  "title": "Build the project",
  "description": "Optional details here",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

---

## Security Features

- Passwords hashed with **bcrypt** (12 salt rounds)
- JWT verified on every protected request
- Tasks are always queried with `userId: req.user.id` — **users can never access other users' tasks**
- Input validation on all routes via **express-validator**
- Generic error messages on login (prevents email enumeration)
- `.env` excluded from Git via `.gitignore`

---

## Deployment Guide

### 1. Deploy Database
Use **Supabase** (free), **Neon** (free), or **Render** (free tier).  
Copy the `DATABASE_URL` connection string.

### 2. Deploy Backend (Render)
1. Push code to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (from `.env.example`)

### 3. Deploy Frontend (Vercel)
1. Create a new project on [vercel.com](https://vercel.com)
2. Root directory: `frontend`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add env variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## Features Checklist

- [x] User registration with password strength validation
- [x] Secure login with JWT
- [x] Session persistence (localStorage + token refresh check)
- [x] Protected routes (frontend + backend)
- [x] Create tasks with title, description, status, priority, due date
- [x] View only your own tasks (enforced at DB query level)
- [x] Toggle task status: Pending → In Progress → Completed
- [x] Delete tasks
- [x] Filter tasks by status
- [x] Search tasks by title
- [x] Task statistics overview with progress bar
- [x] Responsive UI
- [x] Loading skeletons
- [x] Toast notifications for all actions
- [x] Proper error handling (frontend + backend)
- [x] Input validation (frontend + backend)
- [x] Cloud DB support (DATABASE_URL)

---

## Author

Built for the Product Space Full Stack Developer Intern Screening Test.

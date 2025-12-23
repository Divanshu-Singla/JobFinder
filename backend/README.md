# Backend

Express.js REST API with MongoDB.

## Quick Start

```powershell
npm install
npm start
```

**Server:** http://localhost:5000

## Tech Stack

Express 5.1.0 • MongoDB + Mongoose 8.18.2 • JWT 9.0.2 • bcryptjs 3.0.2 • Multer 2.0.2

## Environment (.env)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db
JWT_SECRET=your_secret_key
DEFAULT_ADMIN_USERNAME=Prince
DEFAULT_ADMIN_PASSWORD=Prince@2498
```

## Features

- JWT authentication (User & Admin)
- File uploads (resume, photos)
- Input validation
- MongoDB indexes
- Role-based access control

## Database Seeding

```powershell
node config/seedDatabase.js
```

---

**See [main README](../README.md) for API endpoints and complete documentation**

# Job Portal - MERN Stack Application

A modern job portal with **real-time notifications**, secure authentication, and enterprise-grade security features.

## Quick Start

### Prerequisites
- Node.js v14+
- MongoDB Atlas account OR local MongoDB
- npm v6+

### Installation

**1. Backend Setup**
```powershell
cd backend
npm install
npm start
```

**2. Frontend Setup** (new terminal)
```powershell
cd frontend
npm install
npm start
```

### Access
- **User Portal:** http://localhost:3000
- **Admin Portal:** http://localhost:3000/admin/login
- **Backend API:** http://localhost:5000

### Default Credentials

**Admin Login:**
```
Username: admin
Password: SecureAdmin@2025
```

**Test User (after seeding):**
```
Email: rajesh.kumar@example.com
Password: User@1234
```

---

## Features

### For Users
- ✓ Secure JWT authentication with separate token storage
- ✓ Browse jobs with real-time filters (experience, salary, location)
- ✓ Apply with resume upload (PDF, 5MB max, signature verified)
- ✓ **Real-time notifications** when application status changes
- ✓ Track application status (Pending/Accepted/Rejected)
- ✓ Bookmark jobs (instant updates, no page refresh)
- ✓ Profile management with photo and resume

### For Admins
- ✓ Separate admin authentication (isolated from users)
- ✓ Dashboard with live statistics
- ✓ Create, edit, and delete job postings
- ✓ **Real-time notifications** when users apply
- ✓ View applicants with resume downloads
- ✓ Update application statuses (instant user notification)
- ✓ Multi-admin management

### Real-Time Features (WebSocket)
- 🔔 User gets instant notification when admin accepts/rejects application
- 🔔 Admin gets instant notification when user applies for job
- 🔔 New jobs appear in user's feed immediately
- 🔔 Deleted jobs disappear from user's screen instantly

---

## Technology Stack

**Backend:** 
- Express.js 4.21.2
- MongoDB Atlas + Mongoose 8.18.2
- JWT 9.0.2
- Socket.io 4.6.1 (WebSocket)
- Security: helmet, rate-limit, mongo-sanitize, xss-clean
- Winston logging

**Frontend:** 
- React 19.1.1
- Material-UI 7.3.2
- Socket.io-client 4.6.1
- React Router 7.9.2
- Axios 1.12.2

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login (separate portal)

### Jobs (Public)
- `GET /api/jobs` - List jobs with filters
- `GET /api/jobs/:id` - Job details

### User (Protected)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/jobs/:id/apply` - Apply for job
- `POST /api/users/jobs/:id/bookmark` - Bookmark job
- `DELETE /api/users/jobs/:id/bookmark` - Remove bookmark
- `GET /api/users/bookmarked-jobs` - List bookmarks

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/admin/jobs` - Create job (notifies all users)
- `DELETE /api/admin/jobs/:id` - Delete job (notifies all users)
- `PATCH /api/admin/jobs/:jobId/applicants/:applicantId/status` - Update status (notifies user)
- `GET /api/admin/users` - List users
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/admins` - List admins
- `POST /api/admin/admins` - Add admin
- `DELETE /api/admin/admins/:id` - Delete admin

---

## Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db
JWT_SECRET=<128-character-hex-generated-via-crypto>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=SecureAdmin@2025
NODE_ENV=development
```

---

## Important Notes

### Simultaneous User & Admin Login
- **Both portals can stay logged in at the same time**
- User token stored in `localStorage.userToken`
- Admin token stored in `localStorage.adminToken`
- **Clear browser localStorage** if experiencing logout issues (F12 → Application → Clear)

### Security Features
- ✅ Helmet security headers
- ✅ Rate limiting (100 req/15min general, 5 auth/15min)
- ✅ XSS protection
- ✅ NoSQL injection prevention
- ✅ File signature verification (magic numbers)
- ✅ Winston production logging
- ✅ JWT with 5-hour expiration

### Express Version
- **Uses Express 4.21.2** (not 5.x) for express-validator compatibility
- Downgraded from 5.1.0 to fix sanitizer compatibility issues

---

## Development

### Database Seeding
```powershell
cd backend
node config/seedDatabase.js
```

Creates:
- 1 default admin (admin/SecureAdmin@2025)
- 8 users with profiles
- 10 job postings
- 6 sample applications

### Testing Security
```powershell
cd backend
npm test
```

Validates:
- Dependencies installed
- Environment variables set
- JWT secret strength (128+ chars)
- Logging configuration
- Constants file
- Error middleware
- File signature verification
- Server security middleware

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| User/Admin logout on switching | Clear browser localStorage (F12 → Application → Clear) |
| WebSocket not connecting | Check REACT_APP_API_BASE_URL in frontend/.env |
| Bookmark page refresh | Fixed - now instant updates |
| CORS errors | Fixed - CORS middleware before rate limiting |
| Application status sync | Fixed - updates both Job and User collections |
| Port 5000 in use | `netstat -ano \| findstr :5000` then `taskkill /PID <id> /F` |
| JWT token invalid | Clear browser localStorage and re-login |
| File upload failed | Check file size (max 5MB) and format (PDF/DOC/DOCX) |

---

## Security Features

- bcrypt password hashing
- JWT authentication (5-hour expiration)
- Input validation on all routes
- File upload restrictions
- Role-based access control
- MongoDB injection prevention

---

**Status:** Production Ready ✅ | **Version:** 1.0.0 | **Last Updated:** December 2025

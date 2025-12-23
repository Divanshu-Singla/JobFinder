# Job Portal - Complete Project State Reference
**Last Updated:** December 2025  
**Status:** Production Ready with Real-Time Notifications ✅  
**Version:** 1.2.0

---

## Current State

### Features Implemented
- ✅ Real-Time WebSocket Notifications
- ✅ Dual Authentication (Separate user & admin tokens)
- ✅ Enterprise Security (helmet, rate-limit, XSS, NoSQL injection)
- ✅ Production Logging (Winston)
- ✅ File Upload Security (magic number verification)
- ✅ MongoDB Atlas Integration
- ✅ Express 4.21.2 (compatibility fix)
- ✅ Bookmark Instant Updates
- ✅ Application Status Sync (Job + User collections)

### Tech Stack
**Backend:** Express 4.21.2, MongoDB Atlas, Socket.io 4.6.1, JWT, bcryptjs, helmet, winston  
**Frontend:** React 19.1.1, Socket.io-client 4.6.1, Material-UI 7.3.2, Axios  

---

## WebSocket Events

| Event | Trigger | Listener |
|-------|---------|----------|
| `application-status-updated` | Admin changes status | MyApplicationsPage |
| `new-job-posted` | Admin creates job | HomePage |
| `job-deleted` | Admin deletes job | HomePage |
| `new-application` | User applies | AdminDashboard |

---

## Configuration

### Backend .env
```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_portal_db
JWT_SECRET=<128-char-hex-from-crypto>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=SecureAdmin@2025
NODE_ENV=development
```

### Frontend .env
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

---

## Database Collections

### Users
```javascript
{
  email, password, name, phone, gender, experience, skills,
  appliedJobs: [{ jobId, status, appliedAt }],
  bookmarkedJobs: [jobId]
}
```

### Jobs
```javascript
{
  title, companyName, location, salary, experienceRequired,
  applicants: [{ userId, status, appliedAt }]
}
```

### Admins
```javascript
{
  username, password, isDefault
}
```

---

## API Endpoints

### Auth
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login

### User (Protected)
- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/jobs/:id/apply` - Apply for job
- `POST /api/users/jobs/:id/bookmark` - Bookmark job

### Admin (Protected)
- `GET /api/admin/stats` - Dashboard stats
- `POST /api/admin/jobs` - Create job
- `PATCH /api/admin/jobs/:jobId/applicants/:applicantId/status` - Update status

---

## Testing Credentials

**Admin:** admin / SecureAdmin@2025  
**User:** test@test.com / User@1234  

---

## Known Issues & Solutions

| Issue | Solution |
|-------|----------|
| User/Admin logout on switch | Clear localStorage (F12 → Application) |
| WebSocket not connecting | Check REACT_APP_API_BASE_URL |
| Express 5.x errors | Already downgraded to 4.21.2 |
| CORS errors | Already fixed - CORS before rate limiting |

---

## Quick Start

```powershell
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend  
npm install
npm start
```

**Seed database:** `node backend/config/seedDatabase.js`  
**Test security:** `npm test` in backend/

---
  email: String,           // Unique, used for login
  password: String,        // Bcrypt hashed
  phone: String,
  gender: String,
  experience: Number,
  skills: [String],
  description: String,
  profilePhoto: String,    // File path
  resume: String,          // File path
  appliedJobs: [{          // ✅ CRITICAL: Synced with Job.applicants
    jobId: ObjectId,       // Reference to Job
    appliedAt: Date,
    status: String         // 'Pending', 'Accepted', 'Rejected'
  }],
  bookmarkedJobs: [ObjectId], // Job references
  createdAt: Date,
  updatedAt: Date
}
```
**Current Data:** 8 users with complete profiles

#### 3. Jobs Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  companyName: String,
  location: String,
  salary: Number,          // Annual salary
  experienceRequired: Number,
  jobType: String,         // 'Full-time', 'Part-time', 'Contract', 'Internship'
  requirements: [String],
  postedBy: ObjectId,      // Reference to Admin
  applicants: [{           // ✅ CRITICAL: Synced with User.appliedJobs
    _id: ObjectId,         // Applicant document ID
    userId: ObjectId,      // Reference to User
    appliedAt: Date,
    status: String         // 'Pending', 'Accepted', 'Rejected'
  }],
  createdAt: Date,
  updatedAt: Date
}
```
**Current Data:** 10 jobs across various companies and locations

---

## Key Features & Status

### User Features ✅
- [x] Registration with email validation
- [x] Login with JWT authentication
- [x] Profile management (name, phone, gender, experience, skills, description)
- [x] Profile photo upload (JPG/PNG, max 2MB)
- [x] Resume upload (PDF/DOC/DOCX, max 5MB)
- [x] Browse jobs with filters (experience, salary, location, search)
- [x] Apply for jobs with resume
- [x] View application status (Pending/Accepted/Rejected)
- [x] Withdraw applications
- [x] Bookmark/unbookmark jobs
- [x] View bookmarked jobs
- [x] View all applications with status

### Admin Features ✅
- [x] Separate admin login (username-based)
- [x] Dashboard with statistics (users, jobs, applications, admins)
- [x] Create/edit/delete job postings
- [x] View all users with details
- [x] Delete users
- [x] View applicants for each job
- [x] Update application status (Pending → Accepted/Rejected)
- [x] View/download applicant resumes
- [x] Add new admins (default admin only)
- [x] Delete admins (default admin only, cannot delete self)

### Security Features ✅
- [x] JWT authentication (5-hour expiration)
- [x] Bcrypt password hashing (10 salt rounds)
- [x] Role-based access control (User vs Admin)
- [x] Protected routes on frontend (AdminProtectedRoute, UserProtectedRoute)
- [x] Protected API routes with middleware
- [x] Input validation with express-validator
- [x] MongoDB injection prevention
- [x] File upload restrictions (type, size)
- [x] CORS configuration

---

## Recent Fixes & Enhancements

### 🔧 Fix 1: Status Enum Mismatch (December 22, 2025)
**Issue:** Job applications failing with 500 error  
**Root Cause:** User model used lowercase status enums ('pending'), Job model used capitalized ('Pending')  
**Solution:**
- Updated User model to match Job model: `['Pending', 'Accepted', 'Rejected']`
- Updated userController to use capitalized status values
- Migrated existing database records from lowercase to capitalized

**Files Modified:**
- `backend/models/User.js` - Line 41-47 (status enum)
- `backend/controllers/userController.js` - Line 91 (status value)

---

### 🔧 Fix 2: Bookmark State Synchronization (December 22, 2025)
**Issue:** Bookmark icon not updating immediately after bookmark/unbookmark  
**Root Cause:** JobCard component's local state not syncing with prop changes  
**Solution:**
- Added `useEffect` to sync `isBookmarked` state with `initialBookmarked` prop
- Added `refreshUser()` call after bookmark actions to update AuthContext
- Added error handling to revert optimistic UI updates on failure

**Files Modified:**
- `frontend/src/components/JobCard.js` - Lines 1, 19, 22-24, 119

**Code Changes:**
```javascript
// Added useEffect import
import React, { useState, useMemo, useEffect } from 'react';

// Added refreshUser from context
const { user, refreshUser } = useAuth();

// Added state synchronization
useEffect(() => {
  setIsBookmarked(initialBookmarked || false);
}, [initialBookmarked]);

// Updated handler
const handleBookmarkToggle = async (e) => {
  // ... bookmark logic ...
  await refreshUser(); // Fetch updated user profile
  // ... error handling ...
};
```

---

### 🔧 Fix 3: Application Status Update Not Reflecting (December 22, 2025)
**Issue:** Admin updates application status, but user doesn't see the change  
**Root Cause:** Status stored in TWO places (Job.applicants[] and User.appliedJobs[]), but only Job collection was being updated  
**Solution:**
- Modified `adminController.updateApplicationStatus()` to update BOTH collections
- Added user lookup and status synchronization
- Added logging for debugging

**Files Modified:**
- `backend/controllers/adminController.js` - Lines 210-255

**Code Changes:**
```javascript
exports.updateApplicationStatus = async (req, res) => {
  // ... validation ...
  
  // Update status in job's applicants array
  applicant.status = status;
  await job.save();

  // ✅ CRITICAL FIX: Also update status in user's appliedJobs array
  const user = await User.findById(applicant.userId);
  if (user) {
    const userApplication = user.appliedJobs.find(app => app.jobId.equals(jobId));
    if (userApplication) {
      userApplication.status = status;
      await user.save();
    }
  }
  
  res.json({ msg: 'Status updated successfully', status });
};
```

---

### ✨ Enhancement 1: My Applications Page UI (December 22, 2025)
**Goal:** Make status updates more visible, show updated applications at top  
**Implementation:**
- Smart sorting: Accepted/Rejected at top, Pending below
- Prominent green capsule for Accepted status with checkmark icon
- Red capsule for Rejected status with cancel icon
- Pulse animation on Accepted status for attention
- Colored borders on cards (green/red for updated statuses)
- "Updated" badge on Accepted/Rejected cards
- Status summary section at top (Total, Accepted, Rejected, Pending counts)

**Files Modified:**
- `frontend/src/pages/MyApplicationsPage.js` - Complete redesign

**Visual Hierarchy:**
```
📊 Status Summary (Top)
    ↓
✅ Accepted Applications (Green cards with pulse animation)
    ↓
❌ Rejected Applications (Red cards)
    ↓
⏳ Pending Applications (Regular cards)
```

---

### 🔧 Fix 4: Admin Creation Not Reflecting on Frontend (December 22, 2025)
**Issue:** New admin created successfully but not appearing in admin list  
**Root Cause:** `fetchAdmins()` was called without `await`, causing timing issue  
**Solution:**
- Added `await` to `fetchAdmins()` call after creation
- Added loading state (`creating`) to prevent multiple submissions
- Added input validation before submission
- Enhanced error messages with severity levels (success/error/warning)
- Added loading spinner to Create button

**Files Modified:**
- `frontend/src/pages/AdminAdminsPage.js` - Lines 29, 31, 51-76, 119, 212-218

**Code Changes:**
```javascript
// Added loading state
const [creating, setCreating] = useState(false);

// Enhanced handleCreateAdmin
const handleCreateAdmin = async () => {
  if (!newAdmin.username || !newAdmin.password) {
    setMessage({ text: 'Please fill in all fields', severity: 'warning' });
    return;
  }

  setCreating(true);
  try {
    await API.post('/admin/admins', newAdmin);
    setOpenDialog(false);
    setNewAdmin({ username: '', password: '' });
    
    await fetchAdmins(); // ✅ CRITICAL: Added await
    
    setMessage({ text: 'Admin created successfully', severity: 'success' });
  } catch (error) {
    setMessage({ text: error.response?.data?.msg || 'Error', severity: 'error' });
  } finally {
    setCreating(false);
  }
};
```

---

## Security Hardening

### 🔒 Security Improvements (December 23, 2025)

**Status:** Enterprise-grade security implemented for production deployment

#### 1. Security Middleware Stack
**Location:** `backend/server.js`

**Implemented Protections:**
- ✅ **Helmet**: Sets secure HTTP headers (XSS, clickjacking, MIME sniffing protection)
- ✅ **Rate Limiting**: 
  - General API: 100 requests per 15 minutes per IP
  - Auth endpoints: 5 attempts per 15 minutes per IP
- ✅ **NoSQL Injection Prevention**: Sanitizes MongoDB queries
- ✅ **XSS Protection**: Cleans user input from malicious scripts
- ✅ **CORS**: Whitelist-based origin validation
- ✅ **Request Size Limits**: 10MB max to prevent DoS attacks

**Code Example:**
```javascript
// Security middleware order matters
app.use(helmet());
app.use(limiter); // Rate limiting
app.use(mongoSanitize()); // NoSQL injection prevention
app.use(xss()); // XSS protection
app.use(cors(corsOptions)); // Controlled CORS
```

#### 2. Centralized Error Handling
**Location:** `backend/middleware/errorMiddleware.js`

**Features:**
- Custom `APIError` class for structured errors
- Mongoose error transformation (validation, duplicate keys, cast errors)
- JWT error handling (expired, invalid tokens)
- Multer file upload errors
- Stack traces only in development
- Proper HTTP status codes

**Usage:**
```javascript
const { asyncHandler, APIError } = require('./middleware/errorMiddleware');

// Wrap async routes
router.get('/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new APIError('User not found', 404);
  res.json(user);
}));
```

#### 3. Production Logging System
**Location:** `backend/config/logger.js`

**Configuration:**
- **Winston** logger with multiple transports
- Log levels: error, warn, info, http, debug
- Separate files: `logs/error.log`, `logs/combined.log`
- Automatic log rotation (5MB max, 5 files kept)
- Colorized console output in development
- JSON format for production parsing

**Usage:**
```javascript
const logger = require('./config/logger');

logger.info('Server started on port 5000');
logger.error('Database connection failed', { error: err.message });
logger.warn('Rate limit exceeded for IP: ' + req.ip);
```

#### 4. Configuration Constants
**Location:** `backend/config/constants.js`

**Eliminates Magic Numbers:**
```javascript
// Before
const salt = await bcrypt.genSalt(10); // What's 10?

// After
const salt = await bcrypt.genSalt(constants.BCRYPT_SALT_ROUNDS);
```

**Centralized Values:**
- Security settings (salt rounds, JWT expiration, rate limits)
- File upload limits and allowed types
- Database retry configuration
- API timeouts and pagination
- Application status enums
- Error messages

#### 5. Enhanced File Upload Security
**Location:** `backend/middleware/uploadMiddleware.js`

**Security Layers:**
1. **MIME Type Validation**: Checks Content-Type header
2. **File Extension Validation**: Verifies actual file extension
3. **File Signature Verification**: Reads magic numbers (first bytes) to detect file type spoofing
4. **Size Limits**: Separate limits for photos (2MB) and resumes (5MB)
5. **Filename Sanitization**: Removes special characters to prevent directory traversal
6. **Automatic File Deletion**: Removes suspicious files immediately

**Magic Number Validation:**
```javascript
FILE_SIGNATURES: {
  'image/jpeg': [0xFF, 0xD8, 0xFF],
  'image/png': [0x89, 0x50, 0x4E, 0x47],
  'application/pdf': [0x25, 0x50, 0x44, 0x46]
}
```

**Prevents:**
- Malware disguised as PDFs/images
- Executable files renamed to bypass filters
- Path traversal attacks via filenames

#### 6. Database Connection Resilience
**Location:** `backend/config/db.js`

**Features:**
- 5 retry attempts with exponential backoff
- Connection timeout: 10 seconds
- Automatic reconnection on disconnect
- Detailed error logging
- Graceful failure handling

**Retry Logic:**
```javascript
Initial delay: 5 seconds
Retry 1: Wait 5s
Retry 2: Wait 10s
Retry 3: Wait 20s
Retry 4: Wait 40s
Retry 5: Wait 80s (then exit)
```

#### 7. Environment Separation
**Files Created:**
- `.env.example` - Template with placeholders (safe to commit)
- `.env.development` - Local development config
- `.env.production` - Production config (NEVER commit)

**Critical Changes:**
```env
# Old (INSECURE)
JWT_SECRET=your_jwt_secret_key_here
DEFAULT_ADMIN_PASSWORD=Prince@2498

# New (SECURE)
JWT_SECRET=CHANGE_THIS_TO_SECURE_RANDOM_STRING
DEFAULT_ADMIN_PASSWORD=ChangeThisPassword@123

# Generate secure secret:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 8. Deployment Configurations

**Backend (Render):** `backend/render.yaml`
- Auto-deploy on git push
- Environment variables encrypted in dashboard
- Health check endpoint
- Persistent disk for file uploads (1GB free tier)
- Auto-generated JWT secret

**Frontend (Vercel):** `frontend/vercel.json`
- Static build optimization
- Cache headers for static assets (1 year)
- SPA routing configuration
- Environment variable injection

#### 9. Security Testing
**Location:** `backend/test-security.js`

**Validates:**
- ✅ Security dependencies installed
- ✅ Environment templates secure
- ✅ No hardcoded secrets in .env
- ✅ JWT secret strength (32+ chars)
- ✅ Logging infrastructure
- ✅ Constants configuration
- ✅ Error handling middleware
- ✅ File signature verification
- ✅ Server security middleware
- ✅ .gitignore protections

**Run:** `npm test` in backend directory

---

## Configuration

### Backend Environment Variables

**Development (.env.development):**
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/job_portal_db_dev
JWT_SECRET=dev_secret_change_for_production
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=Admin@123
FRONTEND_URL=http://localhost:3000
```

**Production (.env.production):**
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/job_portal_db
JWT_SECRET=<64-char-random-hex>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=<strong-password>
FRONTEND_URL=https://your-app.vercel.app
```

**⚠️ CRITICAL:** Set production variables in Render dashboard, not in .env file

### Frontend Environment Variables (.env)
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### File Upload Configuration
Located in: `backend/config/constants.js` (centralized)

**Profile Photo:**
- Allowed types: image/jpeg, image/png
- Max size: 2MB
- Storage: uploads/profiles/
- Signature verification: ✅

**Resume:**
- Allowed types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Max size: 5MB
- Storage: uploads/resumes/
- Signature verification: ✅ (PDF only)

---

## API Endpoints

### Authentication Routes
**Base:** `/api/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/admin/login` | Admin login | No |

**Request/Response Examples:**

```javascript
// POST /api/auth/register
Request: {
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass@123",
  gender: "Male"
}
Response: {
  token: "jwt_token_here"
}

// POST /api/auth/login
Request: {
  email: "john@example.com",
  password: "SecurePass@123"
}
Response: {
  token: "jwt_token_here"
}

// POST /api/auth/admin/login
Request: {
  username: "Prince",
  password: "Prince@2498"
}
Response: {
  token: "jwt_token_here"
}
```

---

### User Routes (Protected)
**Base:** `/api/users`  
**Auth:** Requires JWT token with `user` role

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile (multipart/form-data) |
| POST | `/jobs/:id/apply` | Apply for job |
| DELETE | `/jobs/:id/withdraw` | Withdraw application |
| GET | `/applied-jobs` | Get all applications with status |
| POST | `/jobs/:id/bookmark` | Bookmark job |
| DELETE | `/jobs/:id/bookmark` | Remove bookmark |
| GET | `/bookmarked-jobs` | Get all bookmarked jobs |

**Important Notes:**
- Profile update accepts FormData (name, phone, gender, experience, skills, description, profilePhoto, resume)
- Applied jobs return job details + applicationStatus
- Bookmarked jobs return full job objects

---

### Job Routes (Public)
**Base:** `/api/jobs`  
**Auth:** Not required

| Method | Endpoint | Description | Query Params |
|--------|----------|-------------|--------------|
| GET | `/` | List all jobs | ?experience, ?minSalary, ?maxSalary, ?location, ?search |
| GET | `/:id` | Get job details | - |

**Response Example:**
```javascript
// GET /api/jobs
[
  {
    _id: "6493...",
    title: "Senior Full Stack Developer",
    companyName: "Tech Innovations Ltd",
    location: "Bangalore",
    salary: 1500000,
    experienceRequired: 5,
    jobType: "Full-time",
    description: "...",
    requirements: ["React", "Node.js", "MongoDB"],
    applicants: [...],
    createdAt: "2025-12-20T...",
    updatedAt: "2025-12-20T..."
  }
]
```

---

### Admin Routes (Protected)
**Base:** `/api/admin`  
**Auth:** Requires JWT token with `admin` role

#### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats` | Get dashboard statistics |

**Response:**
```javascript
{
  totalAdmins: 1,
  totalUsers: 8,
  totalJobs: 10,
  totalApplications: 10
}
```

#### User Management
| Method | Endpoint | Description | Special Access |
|--------|----------|-------------|----------------|
| GET | `/users` | List all users | Admin |
| DELETE | `/users/:id` | Delete user | Admin |

#### Job Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs` | List all jobs |
| POST | `/jobs` | Create new job |
| PUT | `/jobs/:id` | Update job |
| DELETE | `/jobs/:id` | Delete job |

**Job Creation Request:**
```javascript
{
  title: "Software Engineer",
  companyName: "Tech Corp",
  location: "Mumbai",
  salary: 800000,
  experienceRequired: 2,
  description: "...",
  jobType: "Full-time"
}
```

#### Applicant Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/jobs/:jobId/applicants` | Get all applicants for a job |
| PATCH | `/jobs/:jobId/applicants/:applicantId/status` | Update application status |

**Status Update Request:**
```javascript
{
  status: "Accepted" // or "Rejected" or "Pending"
}
```

**Applicants Response:**
```javascript
{
  job: {
    _id: "...",
    title: "Senior Full Stack Developer",
    companyName: "Tech Innovations Ltd",
    ...
  },
  applicants: [
    {
      _id: "applicant_id",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91-9876543210",
      experience: 5,
      skills: ["React", "Node.js", "MongoDB"],
      resume: "uploads/resumes/1234567890.pdf",
      status: "Accepted",
      appliedAt: "2025-12-20T..."
    }
  ]
}
```

#### Admin Management
| Method | Endpoint | Description | Special Access |
|--------|----------|-------------|----------------|
| GET | `/admins` | List all admins | Admin |
| POST | `/admins` | Create new admin | Default Admin Only |
| DELETE | `/admins/:id` | Delete admin | Default Admin Only |

**Notes:**
- Default admin (isDefault: true) cannot be deleted
- Only default admin can create/delete other admins
- Passwords are hashed before storage

---

## Authentication & Security

### JWT Token Structure
```javascript
// User Token
{
  user: {
    id: "user_id_here"
  },
  iat: 1703260800,
  exp: 1703278800  // 5 hours later
}

// Admin Token
{
  admin: {
    id: "admin_id_here",
    isDefault: true
  },
  iat: 1703260800,
  exp: 1703278800  // 5 hours later
}
```

### Middleware Chain

**User Protected Routes:**
```javascript
router.get('/profile', authUser, getUserProfile);
```

**Admin Protected Routes:**
```javascript
router.get('/stats', authAdmin, getStats);
router.post('/admins', authAdmin, isDefaultAdmin, addAdmin);
```

**Validation Example:**
```javascript
router.post('/jobs', authAdmin, validateJob, postJob);
```

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

**Validation Regex:**
```javascript
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
```

### AuthContext State Management

**Frontend:** `src/context/AuthContext.js`

```javascript
{
  user: {
    _id: "...",
    name: "John Doe",
    email: "john@example.com",
    appliedJobs: [...],
    bookmarkedJobs: [...],
    ...
  },
  admin: {
    id: "...",
    isDefault: true
  },
  loading: false,
  loginUser: async (email, password) => {...},
  loginAdmin: async (username, password) => {...},
  logout: () => {...},
  refreshUser: async () => {...}  // ✅ CRITICAL: Refresh user data
}
```

**Key Function - refreshUser():**
```javascript
const refreshUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const { data } = await API.get('/users/profile');
      setUser(data);  // Updates entire user object including appliedJobs, bookmarkedJobs
    }
  } catch (error) {
    console.error("Failed to refresh user, logging out.", error);
    logout();
  }
};
```

**When to call refreshUser():**
- After applying for a job
- After withdrawing an application
- After bookmarking/unbookmarking a job
- After profile update
- Anytime user data changes on backend

---

## File Upload System

### Multer Configuration
Located in: `backend/middleware/uploadMiddleware.js`

```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.fieldname === 'resume' 
      ? 'uploads/resumes/' 
      : 'uploads/profiles/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePhoto') {
    if (['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG, PNG, SVG allowed'), false);
    }
  } else if (file.fieldname === 'resume') {
    if ([
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX allowed'), false);
    }
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
```

### File Access
Files are served statically via Express:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

**Frontend Access:**
```javascript
// Profile Photo
<img src={`http://localhost:5000/${user.profilePhoto}`} />

// Resume Download
<a href={`http://localhost:5000/${user.resume}`} target="_blank">View Resume</a>
```

---

## Known Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error:** `MongoNetworkError: failed to connect to server`  
**Solution:**
```powershell
net start MongoDB
```

### Issue 2: Port 5000 Already in Use
**Error:** `Error: listen EADDRINUSE: address already in use :::5000`  
**Solution:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Issue 3: JWT Token Invalid
**Error:** `401 Unauthorized` after previously working  
**Solution:**
- Clear browser localStorage
- Re-login to get new token
- Check token expiration (5 hours)

### Issue 4: File Upload Fails
**Possible Causes:**
1. File size exceeds limit (5MB)
2. Invalid file format
3. uploads/ directory doesn't exist

**Solution:**
```powershell
# Create upload directories
mkdir backend/uploads/profiles
mkdir backend/uploads/resumes
```

### Issue 5: Status Not Updating
**Symptom:** Admin changes status but user doesn't see it  
**Status:** ✅ FIXED (December 22, 2025)  
**Solution:** Status now synced in both Job.applicants and User.appliedJobs arrays

### Issue 6: Bookmark Not Reflecting
**Symptom:** Bookmark button clicked but icon doesn't change  
**Status:** ✅ FIXED (December 22, 2025)  
**Solution:** Added useEffect to sync state and refreshUser() call after actions

### Issue 7: Admin Not Appearing After Creation
**Symptom:** New admin created but list doesn't update  
**Status:** ✅ FIXED (December 22, 2025)  
**Solution:** Added await to fetchAdmins() and loading state

---

## Testing Credentials

### Default Admin
```
Username: Prince
Password: Prince@2498
```
**Note:** This is the default admin (cannot be deleted)

### Test Users

**User 1 - Rajesh Kumar**
```
Email: rajesh.kumar@example.com
Password: User@1234
```
- Has 5 applications
- Has 3 bookmarked jobs
- Profile with resume and photo

**User 2 - Priya Sharma**
```
Email: priya.sharma@example.com
Password: User@1234
```

**User 3 - Amit Patel**
```
Email: amit.patel@example.com
Password: User@1234
```

**User 4 - Sneha Reddy**
```
Email: sneha.reddy@example.com
Password: User@1234
```

**User 5 - Vikram Singh**
```
Email: vikram.singh@example.com
Password: User@1234
```

**User 6 - Ananya Iyer**
```
Email: ananya.iyer@example.com
Password: User@1234
```

**User 7 - Rohit Verma**
```
Email: rohit.verma@example.com
Password: User@1234
```

**User 8 - Kavya Nair**
```
Email: kavya.nair@example.com
Password: User@1234
```

### Sample Jobs (10 total)
1. Senior Full Stack Developer - Tech Innovations Ltd (Bangalore)
2. Frontend React Developer - Digital Solutions Inc (Pune)
3. Backend Node.js Engineer - Cloud Systems Co (Hyderabad)
4. UI/UX Designer - Design Studio Pro (Mumbai)
5. DevOps Engineer - Infrastructure Hub (Chennai)
6. Python Developer - Data Analytics Corp (Bangalore)
7. Java Architect - Enterprise Software Ltd (Gurgaon)
8. Mobile App Developer - App Builders Inc (Noida)
9. Data Scientist - AI Research Labs (Bangalore)
10. QA Automation Engineer - Testing Solutions (Pune)

---

## Important Code Patterns

### Pattern 1: Dual Collection Update
**Use Case:** When data exists in multiple collections (e.g., application status)

```javascript
// WRONG - Only updates one collection
const job = await Job.findById(jobId);
const applicant = job.applicants.id(applicantId);
applicant.status = newStatus;
await job.save();

// CORRECT - Updates both collections
const job = await Job.findById(jobId);
const applicant = job.applicants.id(applicantId);
applicant.status = newStatus;
await job.save();

// ✅ Also update user collection
const user = await User.findById(applicant.userId);
const userApplication = user.appliedJobs.find(app => app.jobId.equals(jobId));
userApplication.status = newStatus;
await user.save();
```

### Pattern 2: State Synchronization with Props
**Use Case:** Child component needs to update when parent changes props

```javascript
// WRONG - State initialized once, never updates
const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);

// CORRECT - Syncs with prop changes
const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
useEffect(() => {
  setIsBookmarked(initialBookmarked);
}, [initialBookmarked]);
```

### Pattern 3: Refreshing User Context
**Use Case:** After any operation that modifies user data

```javascript
// Import from context
const { user, refreshUser } = useAuth();

// After operation
const handleApply = async () => {
  await applyForJob(jobId);
  await refreshUser();  // ✅ Fetch updated user data
};
```

### Pattern 4: Optimistic UI Updates with Rollback
**Use Case:** Update UI immediately, revert on error

```javascript
const handleBookmark = async () => {
  const previousState = isBookmarked;
  setIsBookmarked(!isBookmarked);  // Optimistic update
  
  try {
    await bookmarkJob(jobId);
    await refreshUser();
  } catch (error) {
    setIsBookmarked(previousState);  // Revert on error
    console.error('Bookmark failed:', error);
  }
};
```

### Pattern 5: Awaiting Async Operations Before State Updates
**Use Case:** Ensure data is loaded before showing success

```javascript
// WRONG - Race condition
const handleCreate = async () => {
  await API.post('/admin/admins', data);
  fetchAdmins();  // Not awaited!
  setSuccess(true);
};

// CORRECT - Wait for refresh
const handleCreate = async () => {
  await API.post('/admin/admins', data);
  await fetchAdmins();  // ✅ Wait for list to refresh
  setSuccess(true);
};
```

---

## Deployment Notes

### Pre-Deployment Checklist

**⚠️ CRITICAL - Complete Before Deploying:**

1. **Install Security Dependencies**
```powershell
cd backend
npm install
```

2. **Generate Secure JWT Secret**
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy output to `.env` as `JWT_SECRET`

3. **Run Security Tests**
```powershell
cd backend
npm test
```
All tests must pass before deployment.

4. **Set Up MongoDB Atlas** (Free Tier)
- Create account at https://www.mongodb.com/cloud/atlas
- Create M0 (free) cluster
- Add IP whitelist: 0.0.0.0/0 (allow from anywhere) or Render IPs
- Create database user
- Get connection string: `mongodb+srv://<user>:<pass>@cluster.mongodb.net/job_portal_db`

5. **Update Environment Files**
```powershell
# backend/.env.production
MONGO_URI=<your-atlas-connection-string>
JWT_SECRET=<64-char-hex-from-step-2>
DEFAULT_ADMIN_PASSWORD=<strong-unique-password>
FRONTEND_URL=https://your-app.vercel.app
```

---

### Deploying Backend to Render

**Step 1: Prepare Repository**
```powershell
git add .
git commit -m "Security hardening for production"
git push origin main
```

**Step 2: Create Render Service**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name:** job-portal-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run prod`
   - **Plan:** Free

**Step 3: Set Environment Variables in Render Dashboard**
```
NODE_ENV=production
MONGO_URI=<your-atlas-connection-string>
JWT_SECRET=<auto-generate or paste from step 2>
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=<strong-password>
FRONTEND_URL=https://your-app.vercel.app
```

**Step 4: Add Disk for File Uploads**
- Name: `uploads`
- Mount Path: `/opt/render/project/src/uploads`
- Size: 1GB (free tier limit)

**Step 5: Deploy**
- Click "Create Web Service"
- Wait 5-10 minutes for build
- Note the URL: `https://job-portal-backend-xxxx.onrender.com`

---

### Deploying Frontend to Vercel

**Step 1: Update API URL**
```javascript
// frontend/vercel.json
{
  "env": {
    "REACT_APP_API_BASE_URL": "https://your-backend.onrender.com/api"
  }
}
```

**Step 2: Deploy via Vercel CLI**
```powershell
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

Or via Vercel Dashboard:
1. Go to https://vercel.com
2. Import Git Repository
3. Configure:
   - **Framework:** Create React App
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add environment variable:
   - `REACT_APP_API_BASE_URL` = `https://your-backend.onrender.com/api`
5. Deploy

**Step 3: Update Backend CORS**
After deployment, update backend `.env` on Render:
```
FRONTEND_URL=https://your-app.vercel.app
```

---

### Post-Deployment Verification

**Test Health Endpoint:**
```powershell
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "environment": "production",
  "timestamp": "2025-12-23T..."
}
```

**Test Rate Limiting:**
```powershell
# Should block after 5 attempts
for i in {1..6}; do
  curl -X POST https://your-backend.onrender.com/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done
```

**Test Security Headers:**
```powershell
curl -I https://your-backend.onrender.com/api/health
```

Look for:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `X-XSS-Protection: 0`

---

### Database Seeding (Production)

**Option 1: Via Render Shell**
```powershell
# In Render dashboard → Shell tab
node config/seedDatabase.js
```

**Option 2: Local Connection to Atlas**
```powershell
# Update local .env to Atlas URI temporarily
MONGO_URI=mongodb+srv://...

cd backend
node config/seedDatabase.js
```

---

### Starting the Application (Development)

**Quick Start:**
```powershell
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

**With Environment Selection:**
```powershell
# Development mode
cd backend
npm run dev

# Production mode (locally)
cd backend
npm run prod
```

---

### Production Monitoring

**Logs Location:**
- **Render:** Dashboard → Logs tab (real-time)
- **Local (if running):** `backend/logs/`
  - `error.log` - Errors only
  - `combined.log` - All logs

**Key Metrics to Monitor:**
1. **Response Times:** Should be <500ms average
2. **Error Rate:** Should be <1%
3. **Rate Limit Hits:** Track brute force attempts
4. **File Upload Failures:** May indicate attack attempts
5. **Database Connection:** Watch for retry attempts

**Render Free Tier Limitations:**
- Server spins down after 15 min inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month (sufficient for single app)
- 512MB RAM
- No autoscaling

---

### Security Best Practices (Production)

**Never Commit:**
- ❌ `.env` files
- ❌ `logs/` directory
- ❌ `uploads/` with real user files
- ❌ `node_modules/`

**Rotate Secrets Regularly:**
```powershell
# Every 3-6 months
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Update in Render dashboard

**Monitor Failed Login Attempts:**
Check logs for:
```
Rate limit exceeded for IP: xxx.xxx.xxx.xxx
```

**Backup Database:**
```powershell
# MongoDB Atlas auto-backups enabled on M0 (free tier)
# Manual export:
mongoexport --uri="mongodb+srv://..." --collection=users --out=users.json
```

---

### Troubleshooting Deployment

**Issue: Build Fails on Render**
```
Error: Cannot find module 'helmet'
```
**Solution:** Run `npm install` locally first, commit `package.json`

**Issue: CORS Errors**
**Solution:** Check FRONTEND_URL matches exactly (no trailing slash)

**Issue: Database Connection Timeout**
**Solution:** 
1. Check Atlas IP whitelist (use 0.0.0.0/0 for Render)
2. Verify MONGO_URI format includes `retryWrites=true&w=majority`

**Issue: File Uploads Fail in Production**
**Solution:** 
1. Verify disk is mounted at correct path
2. For long-term: migrate to Cloudinary or AWS S3

---

### Production Considerations (Beyond Free Tier)
2. Update MONGO_URI to production database
3. Configure CORS for production domain
4. Set up file upload to cloud storage (S3, Cloudinary)
5. Add rate limiting middleware
6. Set up HTTPS
7. Configure environment-specific .env files
8. Add logging service (Winston, Morgan)
9. Set up monitoring (PM2, New Relic)
10. Configure backup strategy for MongoDB

### Environment Variables Checklist
- [ ] JWT_SECRET (strong, random)
- [ ] MONGO_URI (production database)
- [ ] PORT (5000 or cloud provider default)
- [ ] DEFAULT_ADMIN_USERNAME
- [ ] DEFAULT_ADMIN_PASSWORD
- [ ] REACT_APP_API_URL (production API URL)
- [ ] NODE_ENV=production

---

## Critical Data Integrity Rules

### Rule 1: Application Status Synchronization
**ALWAYS update status in BOTH collections:**
```javascript
// Job collection
job.applicants[index].status = newStatus;
await job.save();

// User collection
user.appliedJobs[index].status = newStatus;
await user.save();
```

### Rule 2: Status Enum Values
**MUST be capitalized:**
- ✅ 'Pending'
- ✅ 'Accepted'
- ✅ 'Rejected'
- ❌ 'pending'
- ❌ 'accepted'
- ❌ 'rejected'

### Rule 3: refreshUser() After User Data Changes
**ALWAYS call after:**
- Job application
- Application withdrawal
- Bookmark add/remove
- Profile update

### Rule 4: File Upload Validation
**Backend (Multer):** File type and size validation  
**Frontend (Optional):** Client-side validation for better UX

### Rule 5: Default Admin Protection
**NEVER allow:**
- Deletion of isDefault: true admin
- Modification of default admin by non-default admins

---

## Frontend State Management

### Global State (AuthContext)
- `user` - Current logged-in user object
- `admin` - Current logged-in admin object
- `loading` - Auth initialization state
- `loginUser()` - User authentication
- `loginAdmin()` - Admin authentication
- `logout()` - Clear all auth state
- `refreshUser()` - Fetch latest user data

### Local State Patterns
```javascript
// Page-level state
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

// Form state
const [formData, setFormData] = useState({ field1: '', field2: '' });

// UI state
const [openDialog, setOpenDialog] = useState(false);
const [message, setMessage] = useState({ text: '', severity: 'success' });
```

---

## API Response Patterns

### Success Response
```javascript
// Single resource
{
  _id: "...",
  name: "...",
  ...
}

// Multiple resources
[
  { _id: "...", name: "..." },
  { _id: "...", name: "..." }
]

// With message
{
  msg: "Operation successful",
  data: {...}
}
```

### Error Response
```javascript
// Validation error
{
  msg: "Validation failed",
  errors: [
    { field: "email", message: "Email is required" },
    { field: "password", message: "Password too short" }
  ]
}

// General error
{
  msg: "Error message here"
}

// Authentication error
{
  msg: "Invalid credentials"
}
```

---

## Testing Checklist

### User Flow Testing
- [ ] Register new user
- [ ] Login with registered user
- [ ] Update profile (with photo and resume)
- [ ] Browse jobs with filters
- [ ] Apply for multiple jobs
- [ ] Check application status
- [ ] Withdraw application
- [ ] Bookmark jobs
- [ ] View bookmarked jobs
- [ ] View all applications
- [ ] Logout

### Admin Flow Testing
- [ ] Login as admin
- [ ] View dashboard statistics
- [ ] Create new job
- [ ] Edit existing job
- [ ] Delete job
- [ ] View all users
- [ ] Delete user
- [ ] View job applicants
- [ ] Update application status (Pending → Accepted)
- [ ] Update application status (Accepted → Rejected)
- [ ] Download applicant resume
- [ ] Create new admin (default admin only)
- [ ] Delete admin (default admin only)
- [ ] Logout

### Data Integrity Testing
- [ ] Verify status syncs in both collections
- [ ] Verify bookmark persists after page refresh
- [ ] Verify application appears immediately after applying
- [ ] Verify status update reflects on user dashboard
- [ ] Verify new admin appears in list immediately
- [ ] Verify file uploads are accessible

---

## Database Backup & Restore

### Backup
```powershell
mongodump --db job_portal_db --out ./backup/$(Get-Date -Format "yyyy-MM-dd")
```

### Restore
```powershell
mongorestore --db job_portal_db ./backup/2025-12-22/job_portal_db
```

### Export Collection
```powershell
mongoexport --db job_portal_db --collection users --out users.json
```

### Import Collection
```powershell
mongoimport --db job_portal_db --collection users --file users.json
```

---

## Performance Optimizations

### Database Indexes
Located in: `backend/models/Job.js`

```javascript
jobSchema.index({ createdAt: -1 });  // Sort by newest
jobSchema.index({ experienceRequired: 1 });  // Filter by experience
jobSchema.index({ salary: 1 });  // Filter by salary
jobSchema.index({ title: 'text', companyName: 'text', location: 'text' });  // Text search
jobSchema.index({ experienceRequired: 1, salary: 1 });  // Compound filter
jobSchema.index({ postedBy: 1, createdAt: -1 });  // Admin's jobs
```

### Frontend Optimizations
- React.memo() for JobCard components
- useMemo() for filtered/sorted lists
- useCallback() for event handlers
- Lazy loading for routes (React.lazy())
- Debounced search inputs (300ms delay)

---

## Maintenance Scripts

### Clear All Applications
```javascript
// backend/scripts/clearApplications.js
const User = require('../models/User');
const Job = require('../models/Job');

async function clearApplications() {
  await User.updateMany({}, { $set: { appliedJobs: [] } });
  await Job.updateMany({}, { $set: { applicants: [] } });
  console.log('All applications cleared');
}
```

### Reset User Passwords
```javascript
// backend/scripts/resetPasswords.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function resetPassword(email, newPassword) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(newPassword, salt);
  await User.findOneAndUpdate({ email }, { password: hashed });
}
```

### Check Data Consistency
```javascript
// backend/scripts/checkConsistency.js
const User = require('../models/User');
const Job = require('../models/Job');

async function checkConsistency() {
  const users = await User.find();
  for (const user of users) {
    for (const app of user.appliedJobs) {
      const job = await Job.findById(app.jobId);
      const jobApplicant = job.applicants.find(a => a.userId.equals(user._id));
      if (app.status !== jobApplicant.status) {
        console.log(`Mismatch for user ${user.email}, job ${job.title}`);
        console.log(`  User: ${app.status}, Job: ${jobApplicant.status}`);
      }
    }
  }
}
```

---

## Troubleshooting Guide

### Problem: "Cannot read property of undefined"
**Cause:** Accessing nested property without checking if parent exists  
**Solution:** Use optional chaining
```javascript
// Before
const name = user.profile.name;

// After
const name = user?.profile?.name;
```

### Problem: "Headers already sent"
**Cause:** Multiple res.send() or res.json() calls  
**Solution:** Use return statements
```javascript
// Before
if (error) {
  res.status(400).json({ msg: 'Error' });
}
res.json({ msg: 'Success' });

// After
if (error) {
  return res.status(400).json({ msg: 'Error' });
}
return res.json({ msg: 'Success' });
```

### Problem: "Unauthorized" errors randomly
**Cause:** JWT token expired (5 hours)  
**Solution:** Implement token refresh or increase expiration
```javascript
jwt.sign(payload, secret, { expiresIn: '24h' });  // Increase to 24h
```

### Problem: File uploads timeout
**Cause:** Large files or slow network  
**Solution:** Increase timeout in Axios
```javascript
const API = axios.create({
  baseURL: API_URL,
  timeout: 30000  // 30 seconds
});
```

---

## Version History

### v1.1.0 (December 23, 2025) - Current
**Status:** Security Hardened - Production Ready ✅

**Major Security Updates:**
1. ✅ **Security Middleware Stack**
   - Helmet for secure HTTP headers
   - Rate limiting (100 req/15min, 5 auth attempts/15min)
   - NoSQL injection prevention
   - XSS protection
   - CORS whitelist enforcement
   - Request size limits

2. ✅ **Centralized Error Handling**
   - Custom APIError class
   - Mongoose error transformation
   - JWT error handling
   - Stack traces hidden in production
   - Proper HTTP status codes

3. ✅ **Production Logging (Winston)**
   - Structured JSON logs
   - File rotation (5MB, 5 files)
   - Separate error logs
   - Colorized console in dev
   - HTTP request logging

4. ✅ **Configuration Management**
   - All magic numbers moved to `constants.js`
   - Centralized security settings
   - File upload limits
   - Database retry config

5. ✅ **Enhanced File Upload Security**
   - MIME type validation
   - File signature verification (magic numbers)
   - Prevents file type spoofing
   - Filename sanitization
   - Automatic malicious file deletion

6. ✅ **Database Resilience**
   - 5 retry attempts with exponential backoff
   - Connection timeout protection
   - Auto-reconnection handling
   - Detailed error logging

7. ✅ **Environment Separation**
   - `.env.example` template
   - `.env.development` for local dev
   - `.env.production` for deployment
   - Secure secret generation guide

8. ✅ **Deployment Configurations**
   - `render.yaml` for backend (Render.com)
   - `vercel.json` for frontend (Vercel)
   - Health check endpoint
   - Auto-deploy on git push

9. ✅ **Security Testing**
   - Automated test script
   - Validates 10+ security checks
   - Run with `npm test`

**Files Added:**
- `backend/config/constants.js`
- `backend/config/logger.js`
- `backend/middleware/errorMiddleware.js`
- `backend/test-security.js`
- `backend/render.yaml`
- `backend/.env.development`
- `backend/.env.production`
- `frontend/vercel.json`
- `backend/logs/` directory

**Files Modified:**
- `backend/package.json` - Added security dependencies
- `backend/server.js` - Security middleware integration
- `backend/config/db.js` - Retry logic
- `backend/middleware/uploadMiddleware.js` - File signature verification
- `backend/routes/api/users.js` - Upload validation middleware
- `backend/.env.example` - Secure defaults

**Breaking Changes:**
- None (backward compatible)

**Migration Steps:**
1. Run `npm install` in backend directory
2. Generate new JWT_SECRET (see guide in .env.example)
3. Run `npm test` to verify security
4. Update production environment variables

---

### v1.0.0 (December 22, 2025)
**Status:** Functional - Not Production Secure

**Features:**
- Complete user and admin portals
- Job management system
- Application tracking with status updates
- File upload system (resume, profile photo)
- Bookmark functionality
- Responsive Material-UI design

**Fixes:**
1. Status enum standardization (Pending/Accepted/Rejected)
2. Bookmark state synchronization with useEffect
3. Dual collection status update (Job + User)
4. Enhanced My Applications UI with sorting and visual status
5. Admin creation frontend sync with await

**Known Limitations:**
- ❌ No security middleware (Helmet, rate limiting)
- ❌ No error handling middleware
- ❌ No production logging
- ❌ Magic numbers hardcoded
- ❌ No file signature verification
- ❌ No database retry logic
- ❌ No deployment configs
- No email verification
- No forgot password feature
- No real-time notifications
- No job expiration dates
- No salary range storage (only single number)
- No multi-language support

**Future Enhancements (Not Implemented):**
- [ ] Email verification with SendGrid/Nodemailer
- [ ] Password reset functionality
- [ ] Real-time notifications with Socket.io
- [ ] Job expiration and auto-archive
- [ ] Advanced search with Elasticsearch
- [ ] Admin analytics dashboard with charts
- [ ] Export data to CSV/PDF
- [ ] Bulk operations (bulk delete, bulk update)
- [ ] Job categories and tags
- [ ] Applicant ranking/scoring system
- [ ] Interview scheduling
- [ ] Chat between users and admins
- [ ] Mobile app (React Native)

---

## Quick Reference Commands

### Start Development
```powershell
# MongoDB
net start MongoDB

# Backend (Terminal 1)
cd d:\jp\backend
npm start

# Frontend (Terminal 2)
cd d:\jp\frontend
npm start
```

### Seed Database
```powershell
cd d:\jp\backend
node config/seedDatabase.js
```

### Check Database
```powershell
mongosh
use job_portal_db
db.users.countDocuments()
db.jobs.countDocuments()
db.admins.countDocuments()
```

### Kill Port Process
```powershell
# Port 5000 (Backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Port 3000 (Frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Quick Reference Commands

### Security Setup (First Time)
```powershell
# 1. Install dependencies
cd backend
npm install

# 2. Generate JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
# Copy output to .env as JWT_SECRET

# 3. Run security tests
npm test

# 4. Start development
npm start
```

### Start Development
```powershell
# MongoDB
net start MongoDB

# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start
```

### Seed Database
```powershell
cd backend
node config/seedDatabase.js
```

### Check Security
```powershell
cd backend
npm test
```

### View Logs
```powershell
# Error logs only
type backend\logs\error.log

# All logs
type backend\logs\combined.log
```

### Deploy to Production
```powershell
# 1. Update environment variables in Render dashboard
# 2. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 3. Render auto-deploys backend
# 4. Deploy frontend to Vercel
cd frontend
vercel --prod
```

---

## Contact & Support

**Project Directory:** `c:\Users\crski\Downloads\job\`  
**Documentation:** `README.md`, `PROJECT_STATE.md`  
**Last Updated:** December 23, 2025

**Key Files:**
- Security: `backend/test-security.js`
- Configuration: `backend/config/constants.js`
- Logging: `backend/config/logger.js`
- Deployment: `backend/render.yaml`, `frontend/vercel.json`

---

## End of Document

This document contains the complete state of the Job Portal project as of December 23, 2025 (v1.1.0 - Security Hardened).

**✅ Enterprise-grade security implemented**  
**✅ Production logging and monitoring**  
**✅ Database resilience and retry logic**  
**✅ Deployment configs for Render + Vercel**  
**✅ Automated security testing**  
**✅ Environment separation**  
**✅ All critical bugs fixed**  
**✅ Ready for 100-user production deployment**  

**⚠️ Before Production Deployment:**
1. Run `npm install` in backend
2. Run `npm test` - all tests must pass
3. Generate secure JWT_SECRET
4. Set up MongoDB Atlas
5. Update environment variables in Render
6. Test health endpoint after deployment

---

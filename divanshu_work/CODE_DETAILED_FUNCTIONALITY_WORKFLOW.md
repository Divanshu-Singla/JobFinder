# JobFinder Portal - Detailed Functionality & Workflow Documentation

**Project:** MERN Stack Job Portal with Real-Time Features  
**Version:** 1.2.0  
**Last Updated:** December 24, 2025

---

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Authentication & Authorization Flow](#authentication--authorization-flow)
3. [User Management Workflow](#user-management-workflow)
4. [Job Management Workflow](#job-management-workflow)
5. [Application Management Workflow](#application-management-workflow)
6. [Real-Time WebSocket Communication](#real-time-websocket-communication)
7. [File Upload & Storage System](#file-upload--storage-system)
8. [Security Implementation](#security-implementation)
9. [Database Schema & Relationships](#database-schema--relationships)
10. [API Request-Response Flow](#api-request-response-flow)

---

## System Architecture Overview

### Technology Stack

#### Backend (Express.js)
```
backend/
├── server.js              # Entry point, middleware setup
├── config/
│   ├── db.js             # MongoDB connection
│   ├── socket.js         # WebSocket configuration
│   ├── gridfs.js         # File storage configuration
│   ├── logger.js         # Winston logging
│   ├── seed.js           # Default admin seeding
│   └── constants.js      # Configuration constants
├── controllers/          # Business logic
├── middleware/           # Request processing
├── models/              # MongoDB schemas
└── routes/              # API endpoints
```

#### Frontend (React)
```
frontend/
├── src/
│   ├── App.js           # Main app component
│   ├── context/
│   │   ├── AuthContext.js    # Authentication state
│   │   └── SocketContext.js  # WebSocket state
│   ├── components/      # Reusable components
│   ├── pages/          # Route components
│   ├── api/            # API client
│   └── utils/          # Helper functions
```

### System Flow Diagram
```
┌─────────────┐      HTTP/WS      ┌──────────────┐      MongoDB      ┌──────────┐
│   React     │ ◄──────────────► │   Express    │ ◄──────────────► │ Database │
│   Frontend  │                  │   Backend    │                  │          │
└─────────────┘                  └──────────────┘                  └──────────┘
      │                                 │
      │                                 │
      ▼                                 ▼
┌─────────────┐                  ┌──────────────┐
│ localStorage│                  │  Cloudinary  │
│   (Tokens)  │                  │  (Files)     │
└─────────────┘                  └──────────────┘
```

---

## Authentication & Authorization Flow

### 1. User Registration Workflow

**Frontend Process:**
```
User fills form → Validation → API Call → Token Storage → Redirect
```

**Step-by-Step:**

1. **User Input** (RegisterPage.js)
   ```javascript
   - Name (2-50 chars, letters only)
   - Email (valid format)
   - Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special)
   - Confirm Password (must match)
   - Gender (Male/Female/Other)
   ```

2. **Frontend Validation** (utils/validation.js)
   ```javascript
   validateName()     // Check length and characters
   validateEmail()    // Regex pattern match
   validatePassword() // Strength validation
   ```

3. **API Request** (AuthContext.js)
   ```javascript
   POST /api/auth/register
   Body: { name, email, password, gender }
   ```

4. **Backend Validation** (validationMiddleware.js)
   ```javascript
   validateUserRegistration middleware:
   - Sanitize inputs (mongoSanitize, xss-clean)
   - Check required fields
   - Validate format
   ```

5. **Controller Logic** (authController.js)
   ```javascript
   registerUser():
   a. Check if email exists
   b. Hash password (bcrypt, 10 rounds)
   c. Create User document
   d. Generate JWT token
   e. Return token
   ```

6. **JWT Token Generation**
   ```javascript
   Payload: {
     user: { id: user._id },
     iat: issuedAt,
     exp: expiresIn (5 hours)
   }
   Secret: process.env.JWT_SECRET
   ```

7. **Frontend Response**
   ```javascript
   - Token received
   - Redirect to /login
   - User can now login
   ```

### 2. User Login Workflow

**Flow:**
```
Credentials → Validation → DB Check → Token → Profile Fetch → Update Context
```

**Detailed Steps:**

1. **User Input** (LoginPage.js)
   ```javascript
   Email: string
   Password: string
   ```

2. **API Call**
   ```javascript
   POST /api/auth/login
   Body: { email, password }
   ```

3. **Backend Authentication**
   ```javascript
   loginUser():
   a. Find user by email
   b. Compare passwords (bcrypt.compare)
   c. Generate JWT token
   d. Return token
   ```

4. **Token Storage** (AuthContext.js)
   ```javascript
   localStorage.setItem('userToken', token)
   ```

5. **Profile Fetch**
   ```javascript
   GET /api/users/profile
   Headers: { Authorization: 'Bearer <token>' }
   ```

6. **Context Update**
   ```javascript
   setUser(profile)
   User now authenticated
   ```

### 3. Admin Login Workflow

**Differences from User Login:**

1. **Separate Endpoint**
   ```javascript
   POST /api/auth/admin/login
   Body: { username, password }
   ```

2. **Different Token Structure**
   ```javascript
   Payload: {
     admin: {
       id: admin._id,
       isDefault: admin.isDefault
     }
   }
   ```

3. **Separate Storage**
   ```javascript
   localStorage.setItem('adminToken', token)
   ```

4. **No Profile Fetch** (minimal data in token)

### 4. Authorization Middleware

**authUser Middleware:**
```javascript
Request → Extract Token → Verify JWT → Attach user.id → Next
```

**authAdmin Middleware:**
```javascript
Request → Extract Token → Verify JWT → Check admin exists → Attach admin → Next
```

**Token Validation:**
```javascript
1. Check Authorization header exists
2. Extract token from "Bearer <token>"
3. Verify with JWT_SECRET
4. Check expiration
5. Validate user/admin still exists in DB
6. Attach to req.user or req.admin
```

---

## User Management Workflow

### 1. User Profile Management

**Get Profile Flow:**
```
User Request → authUser → getUserProfile → Fetch from DB → Return (exclude password)
```

**Update Profile Flow:**
```javascript
1. User submits form with:
   - name, phone, gender, experience, skills, description
   - profilePhoto (file)
   - resume (file)

2. Multer middleware processes files:
   - profilePhoto: max 5MB, images only
   - resume: max 5MB, PDF/DOC/DOCX only

3. Upload to Cloudinary (GridFS)

4. Update User document in MongoDB

5. Return updated profile
```

**Code Flow:**
```javascript
PUT /api/users/profile
├── authUser (verify token)
├── upload.fields() (multer)
├── validateUserProfile (validate data)
└── updateUserProfile (controller)
    ├── Extract fields from req.body
    ├── Upload files to Cloudinary
    ├── Update User.findByIdAndUpdate()
    └── Return updated user
```

### 2. User Dashboard

**Data Fetching:**
```javascript
useEffect() on mount:
  1. Fetch applied jobs: GET /api/users/applied-jobs
  2. Fetch bookmarked jobs: GET /api/users/bookmarked-jobs
  3. Fetch user profile: GET /api/users/profile
  4. Update state
```

**Real-Time Updates:**
```javascript
Socket.on('application-status-updated'):
  - Receive notification
  - Update applied jobs list
  - Show notification snackbar
```

---

## Job Management Workflow

### 1. Job Listing & Filtering

**Frontend Flow:**
```javascript
HomePage:
  1. Initialize filters state
  2. Fetch jobs with filters: GET /api/jobs?experience=0&salary=50000
  3. Display JobCard components
  4. User changes filter → Update state → Refetch
```

**Backend Processing:**
```javascript
getAllJobs controller:
  1. Extract query params: { experience, salary }
  2. Build MongoDB filter:
     - experience: exact match or $gte for 3+
     - salary: $gte (greater than or equal)
  3. Execute: Job.find(filter).sort({ createdAt: -1 })
  4. Return jobs array
```

**Filter Logic:**
```javascript
Experience Filter:
  - "Fresher" (0) → experienceRequired: 0
  - "1 Year" → experienceRequired: 1
  - "2 Years" → experienceRequired: 2
  - "3+ Years" → experienceRequired: { $gte: 3 }

Salary Filter:
  - User enters: 50000
  - Query: salary: { $gte: 50000 }
```

### 2. Job Creation (Admin)

**Flow:**
```javascript
Admin Dashboard → Add Job → Fill Form → Validation → API Call → Database
```

**Validation Rules:**
```javascript
- Title: 3-100 characters
- Company Name: 2-100 characters
- Location: 2-100 characters
- Salary: positive number
- Experience: 0-50 years
- Description: 10-5000 characters
- Job Type: Full-time/Part-time/Contract/Internship
```

**API Flow:**
```javascript
POST /api/admin/jobs
├── authAdmin (verify admin token)
├── validateJob (validation middleware)
└── postJob (controller)
    ├── Create new Job document
    ├── Set postedBy: req.admin.id
    ├── Save to database
    ├── notifyAllUsers() via WebSocket
    └── Return created job
```

**Real-Time Notification:**
```javascript
notifyAllUsers('new-job-posted', {
  jobId, title, companyName, location, salary
})
→ All connected users receive notification
→ Frontend shows snackbar
→ Job list updates automatically
```

### 3. Job Deletion (Admin)

**Flow with Applicant Cleanup:**
```javascript
Delete Request → Confirm → API Call → Remove from Users → Delete Job
```

**Backend Logic:**
```javascript
deleteJob controller:
  1. Find job by ID
  2. Remove from all users' appliedJobs:
     User.updateMany(
       { 'appliedJobs.jobId': jobId },
       { $pull: { appliedJobs: { jobId } } }
     )
  3. Remove from all users' bookmarkedJobs:
     User.updateMany(
       { bookmarkedJobs: jobId },
       { $pull: { bookmarkedJobs: jobId } }
     )
  4. Delete job: job.deleteOne()
  5. notifyAllUsers('job-deleted') via WebSocket
  6. Return success
```

---

## Application Management Workflow

### 1. Job Application Process

**User Applies for Job:**

```javascript
JobDetailsPage → Apply Button → API Call → Update Both Collections
```

**Detailed Flow:**
```javascript
POST /api/users/jobs/:id/apply
├── authUser (verify user token)
├── validateJobId (validate MongoDB ID)
└── applyForJob (controller)
    ├── Find job by ID
    ├── Find user by req.user.id
    ├── Check if already applied
    ├── Add to job.applicants[]
    │   └── { userId, appliedAt, status: 'Pending' }
    ├── Add to user.appliedJobs[]
    │   └── { jobId, appliedAt, status: 'Pending' }
    ├── Save both documents
    ├── notifyAllAdmins() via WebSocket
    └── Return success
```

**WebSocket Notification to Admins:**
```javascript
notifyAllAdmins('new-application', {
  userId, userName, userEmail,
  jobId, jobTitle, companyName,
  message: "${userName} applied for ${jobTitle}"
})
```

### 2. Viewing Applicants (Admin)

**Flow:**
```javascript
Admin Jobs Page → View Applicants Button → Fetch → Display List
```

**API Call:**
```javascript
GET /api/admin/jobs/:jobId/applicants
├── authAdmin
├── validateJobIdForApplicants
└── getJobApplicants
    ├── Find job by ID
    ├── Populate applicants.userId
    ├── Filter out deleted users
    ├── Map to applicant details:
    │   ├── name, email, phone, gender
    │   ├── experience, skills, description
    │   ├── profilePhoto, resume URLs
    │   ├── status (Pending/Accepted/Rejected)
    │   └── appliedAt timestamp
    └── Return { job, applicants }
```

**Frontend Display:**
```javascript
AdminApplicantsPage:
  - Job details card
  - Applicants table with:
    - Profile photo
    - Name, email, phone
    - Experience, skills
    - Status badge (color-coded)
    - View Resume button
    - Status dropdown (Pending/Accepted/Rejected)
```

### 3. Updating Application Status

**Flow:**
```javascript
Admin selects status → Confirm → API Call → Update Both Collections → Notify User
```

**Backend Logic:**
```javascript
PATCH /api/admin/jobs/:jobId/applicants/:applicantId/status
Body: { status: 'Accepted' | 'Rejected' }

updateApplicationStatus controller:
  1. Validate status value
  2. Find job by jobId
  3. Find applicant in job.applicants array
  4. Update applicant.status
  5. Save job
  
  6. Find user by userId
  7. Find application in user.appliedJobs array
  8. Update application.status
  9. Save user
  
  10. notifyUser(userId, 'application-status-updated', {
       jobTitle, companyName, status
     })
  
  11. Return success
```

**Real-Time User Notification:**
```javascript
User's frontend receives:
  event: 'application-status-updated'
  data: { jobTitle, companyName, status }

SocketContext handles:
  - Add to notifications array
  - Show snackbar
  - Update applied jobs list
```

### 4. Withdraw Application (User)

**Flow:**
```javascript
My Applications → Withdraw Button → Confirm → Remove from Both Collections
```

**Backend:**
```javascript
DELETE /api/users/jobs/:id/withdraw

withdrawApplication controller:
  1. Remove from job.applicants:
     Job.findByIdAndUpdate(jobId, {
       $pull: { applicants: { userId } }
     })
  
  2. Remove from user.appliedJobs:
     User.findByIdAndUpdate(userId, {
       $pull: { appliedJobs: { jobId } }
     })
  
  3. Return success
```

---

## Real-Time WebSocket Communication

### 1. WebSocket Initialization

**Backend Setup (config/socket.js):**
```javascript
const { Server } = require('socket.io');

initializeSocket(server):
  1. Create Socket.io server
  2. Configure CORS
  3. Setup authentication middleware:
     - Extract token from handshake
     - Verify JWT
     - Attach userId or adminId to socket
  4. Handle connection event
  5. Store connected sockets
```

**Frontend Setup (SocketContext.js):**
```javascript
useEffect():
  1. Get token from localStorage
  2. Connect to backend:
     socket = io(API_URL, {
       auth: { token }
     })
  3. Handle connection events
  4. Setup event listeners
  5. Cleanup on unmount
```

### 2. Event Types & Flow

**Event: new-job-posted**
```javascript
Admin creates job
  ↓
Backend: notifyAllUsers('new-job-posted', jobData)
  ↓
Socket.io broadcasts to all user sockets
  ↓
Frontend: SocketContext receives event
  ↓
Update notifications state
  ↓
Show snackbar notification
  ↓
Refresh job list (if on homepage)
```

**Event: new-application**
```javascript
User applies for job
  ↓
Backend: notifyAllAdmins('new-application', appData)
  ↓
Socket.io broadcasts to all admin sockets
  ↓
Admin dashboard receives event
  ↓
Show notification
  ↓
Update stats/applicants count
```

**Event: application-status-updated**
```javascript
Admin changes status
  ↓
Backend: notifyUser(userId, 'application-status-updated', data)
  ↓
Socket.io emits to specific user socket
  ↓
User's frontend receives event
  ↓
Show notification with status
  ↓
Update applied jobs list
```

**Event: job-deleted**
```javascript
Admin deletes job
  ↓
Backend: notifyAllUsers('job-deleted', { jobId })
  ↓
Broadcast to all users
  ↓
Frontend removes job from UI
  ↓
Update bookmarks if needed
```

### 3. Notification System

**SocketContext State:**
```javascript
const [notifications, setNotifications] = useState([]);

addNotification(notification):
  - Add to array with timestamp
  - Show snackbar
  - Auto-hide after 5 seconds

clearNotifications():
  - Empty notifications array
```

**Notification Structure:**
```javascript
{
  id: uniqueId,
  type: 'new-job-posted' | 'new-application' | 'application-status-updated',
  message: string,
  data: object,
  timestamp: Date
}
```

---

## File Upload & Storage System

### 1. Cloudinary Configuration (GridFS)

**Setup:**
```javascript
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
```

**Benefits:**
- Permanent cloud storage
- Automatic backups
- CDN delivery
- No server disk space needed
- Scalable

### 2. File Upload Flow

**Multer Configuration:**
```javascript
const storage = multer.memoryStorage(); // Store in memory temporarily

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'profilePhoto') {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
  
  if (file.fieldname === 'resume') {
    // Accept documents only
    const allowed = ['application/pdf', 'application/msword', ...];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/DOC/DOCX allowed'));
    }
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
});
```

**Upload Process:**
```javascript
1. Client selects file
2. FormData sent to backend
3. Multer intercepts file
4. File stored in memory buffer
5. uploadToGridFS function called:
   - Create readable stream from buffer
   - Upload to Cloudinary
   - Get secure URL
   - Return URL
6. URL saved in MongoDB document
7. Client receives URL
```

**Cloudinary Upload:**
```javascript
uploadToGridFS(file, folder):
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        resolve(result.secure_url);
      }
    );
    
    streamifier.createReadStream(file.buffer)
      .pipe(uploadStream);
  });
```

### 3. File Retrieval

**Resume Download:**
```javascript
GET /api/files/resume/:fileId

File URL stored in user.resume
  ↓
Frontend opens Cloudinary URL
  ↓
Browser downloads/displays file
```

**Profile Photo Display:**
```javascript
<img src={user.profilePhoto} />
  ↓
Cloudinary CDN serves image
  ↓
Automatic optimization
```

---

## Security Implementation

### 1. Password Security

**Hashing:**
```javascript
Registration/Password Change:
  1. Generate salt: bcrypt.genSalt(10)
  2. Hash password: bcrypt.hash(password, salt)
  3. Store hashed password in DB
  4. Never store plain text

Login:
  1. Get hashed password from DB
  2. Compare: bcrypt.compare(plainPassword, hashedPassword)
  3. Return boolean
```

### 2. JWT Token Security

**Generation:**
```javascript
jwt.sign(
  payload,              // User/Admin data
  process.env.JWT_SECRET,  // Secret key (64 bytes random)
  { expiresIn: '5h' }   // Expiration
)
```

**Verification:**
```javascript
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  // Token valid
} catch (error) {
  // Token invalid or expired
}
```

**Storage:**
```javascript
// Separate tokens prevent session conflicts
localStorage.setItem('userToken', token);
localStorage.setItem('adminToken', token);
```

### 3. Input Validation & Sanitization

**Middleware Chain:**
```javascript
Request
  ↓
express-mongo-sanitize (prevent NoSQL injection)
  ↓
xss-clean (prevent XSS attacks)
  ↓
express-validator (validate format)
  ↓
Controller
```

**Validation Example:**
```javascript
validateUserRegistration = [
  body('email')
    .notEmpty()
    .isEmail()
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
  
  validate
];
```

### 4. Rate Limiting

**General API:**
```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,                   // 100 requests per window
  message: 'Too many requests'
});
app.use('/api/', limiter);
```

**Auth Endpoints:**
```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Only 5 login attempts
  skipSuccessfulRequests: true
});
app.use('/api/auth/login', authLimiter);
```

### 5. CORS Configuration

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,  // Allow cookies
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### 6. Helmet Security Headers

```javascript
app.use(helmet({
  contentSecurityPolicy: false,  // For API
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
```

---

## Database Schema & Relationships

### 1. User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  gender: String (Male/Female/Other),
  experience: Number (years),
  skills: [String],
  description: String,
  profilePhoto: String (Cloudinary URL),
  resume: String (Cloudinary URL),
  
  appliedJobs: [{
    jobId: ObjectId (ref: 'Job'),
    appliedAt: Date,
    status: String (Pending/Accepted/Rejected)
  }],
  
  bookmarkedJobs: [ObjectId] (ref: 'Job'),
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
email: unique
appliedJobs.jobId: indexed
bookmarkedJobs: indexed
```

### 2. Job Model

```javascript
{
  title: String (required),
  description: String (required),
  companyName: String (required),
  location: String (required),
  salary: Number (required),
  experienceRequired: Number (required),
  jobType: String (Full-time/Part-time/Contract/Internship),
  requirements: [String],
  
  postedBy: ObjectId (ref: 'Admin', required),
  
  applicants: [{
    userId: ObjectId (ref: 'User'),
    appliedAt: Date,
    status: String (Pending/Accepted/Rejected)
  }],
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
createdAt: -1 (descending)
experienceRequired: 1
salary: 1
{ experienceRequired: 1, salary: 1 } (compound)
{ title: 'text', companyName: 'text', location: 'text' }
{ postedBy: 1, createdAt: -1 }
```

### 3. Admin Model

```javascript
{
  username: String (required, unique),
  password: String (required, hashed),
  isDefault: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
```javascript
username: unique
```

### 4. Data Relationships

```
User ──────┬──────► Job (via appliedJobs.jobId)
           │
           └──────► Job (via bookmarkedJobs)

Job ───────► Admin (via postedBy)
    ───────► User (via applicants.userId)
```

**Cascading Deletes:**
```javascript
When User deleted:
  - Remove from job.applicants[]
  
When Job deleted:
  - Remove from user.appliedJobs[]
  - Remove from user.bookmarkedJobs[]
  
When Admin deleted:
  - Jobs remain (postedBy still referenced)
  - Prevent default admin deletion
```

---

## API Request-Response Flow

### Complete Request Lifecycle

**Example: Apply for Job**

1. **Frontend Initiates:**
```javascript
// User clicks Apply button
const handleApply = async () => {
  try {
    const { data } = await API.post(`/users/jobs/${jobId}/apply`);
    setApplied(true);
    showNotification('Application submitted');
  } catch (error) {
    showError(error.message);
  }
};
```

2. **API Client Intercepts:**
```javascript
// api/index.js
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('userToken');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});
```

3. **Request Reaches Backend:**
```javascript
POST http://localhost:5000/api/users/jobs/123/apply
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

4. **Middleware Chain Executes:**
```javascript
Express App
  ↓
CORS Check
  ↓
Rate Limiter (check requests/min)
  ↓
Body Parser (parse JSON)
  ↓
Sanitize (prevent injection)
  ↓
Route Match: /api/users/jobs/:id/apply
  ↓
authUser Middleware:
  - Extract token
  - Verify JWT
  - Attach req.user
  ↓
validateJobId Middleware:
  - Check ID format
  - Validate MongoDB ObjectId
  ↓
Controller: applyForJob
```

5. **Controller Processes:**
```javascript
exports.applyForJob = async (req, res) => {
  try {
    // 1. Database Operations
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user.id);
    
    // 2. Business Logic
    const alreadyApplied = user.appliedJobs.some(...);
    if (alreadyApplied) {
      return res.status(400).json({ msg: 'Already applied' });
    }
    
    // 3. Update Documents
    job.applicants.push({ userId, appliedAt, status: 'Pending' });
    user.appliedJobs.push({ jobId, appliedAt, status: 'Pending' });
    
    await job.save();
    await user.save();
    
    // 4. WebSocket Notification
    notifyAllAdmins('new-application', { ... });
    
    // 5. Send Response
    res.json({ msg: 'Application successful', status: 'Pending' });
    
  } catch (err) {
    // 6. Error Handling
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
```

6. **Response Returns:**
```javascript
HTTP/1.1 200 OK
Content-Type: application/json

{
  "msg": "Application successful",
  "status": "Pending"
}
```

7. **Frontend Receives:**
```javascript
// API client intercepts response
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired
      logout();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);

// Component handles response
setApplied(true);
showNotification('Application submitted');
```

8. **Real-Time Update:**
```javascript
// Admin dashboard receives WebSocket event
socket.on('new-application', (data) => {
  console.log('New application:', data);
  addNotification(data);
  refreshStats();
});
```

---

## Error Handling & Logging

### 1. Error Types

**Validation Errors:**
```javascript
{
  success: false,
  errors: [
    { field: 'email', message: 'Invalid email format' },
    { field: 'password', message: 'Password too short' }
  ]
}
```

**Authentication Errors:**
```javascript
{
  msg: 'Token expired'  // Status 401
}
```

**Business Logic Errors:**
```javascript
{
  msg: 'You have already applied for this job'  // Status 400
}
```

**Server Errors:**
```javascript
{
  msg: 'Server error',
  error: error.message  // Status 500 (production hides details)
}
```

### 2. Logging (Winston)

```javascript
logger.info('User registered', { userId, email });
logger.warn('Multiple login attempts', { ip, email });
logger.error('Database connection failed', { error: err.message });
```

**Log Levels:**
- error: 0
- warn: 1
- info: 2
- http: 3
- verbose: 4
- debug: 5
- silly: 6

---

## Performance Optimizations

### 1. Database Indexing

```javascript
// Speeds up queries
jobSchema.index({ createdAt: -1 });  // Sorting
jobSchema.index({ experienceRequired: 1, salary: 1 });  // Filtering
jobSchema.index({ title: 'text' });  // Text search
```

### 2. Pagination (Future Enhancement)

```javascript
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 20;
const skip = (page - 1) * limit;

const jobs = await Job.find()
  .limit(limit)
  .skip(skip)
  .sort({ createdAt: -1 });
```

### 3. Selective Field Return

```javascript
// Don't return passwords
User.findById(id).select('-password');

// Only return needed fields
User.find().select('name email profilePhoto');
```

### 4. Connection Pooling

```javascript
mongoose.connect(MONGO_URI, {
  maxPoolSize: 10,  // Max simultaneous connections
  minPoolSize: 5
});
```

---

## Environment Configuration

### Backend (.env)
```bash
# Server
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jobfinder

# Authentication
JWT_SECRET=64_byte_random_hex_string

# Admin
DEFAULT_ADMIN_USERNAME=admin
DEFAULT_ADMIN_PASSWORD=SecureAdmin@2025

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (.env)
```bash
REACT_APP_API_BASE_URL=https://your-backend.onrender.com/api
```

---

## Deployment Architecture

### Production Setup

```
                   Internet
                      │
                      ▼
               ┌──────────────┐
               │   Vercel     │ (Frontend)
               │   CDN        │
               └──────┬───────┘
                      │
                      ▼
               ┌──────────────┐
               │   Render     │ (Backend API)
               │   Node.js    │
               └──────┬───────┘
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
    ┌─────────────┐      ┌─────────────┐
    │  MongoDB    │      │ Cloudinary  │
    │   Atlas     │      │  (Files)    │
    └─────────────┘      └─────────────┘
```

### Health Monitoring

**Endpoint:**
```javascript
GET /api/health

Response: {
  status: 'healthy',
  timestamp: Date,
  uptime: process.uptime(),
  database: 'connected'
}
```

---

## Testing Strategy

### 1. Manual Testing

See: `TESTING_GUIDE.md`

### 2. Automated Testing (Future)

```javascript
// Example unit test
describe('User Authentication', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name, email, password, gender });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

---

## Troubleshooting Common Issues

### 1. WebSocket Not Connecting
```javascript
Problem: socket.connected === false
Solutions:
  - Check REACT_APP_API_BASE_URL in frontend/.env
  - Verify backend allows CORS from frontend domain
  - Check token is valid
```

### 2. File Upload Failing
```javascript
Problem: 400 Bad Request on file upload
Solutions:
  - Check file size < 5MB
  - Verify file type (PDF/DOC/DOCX for resume)
  - Check Cloudinary credentials
```

### 3. Token Expired
```javascript
Problem: 401 Unauthorized
Solutions:
  - Clear localStorage and re-login
  - Tokens expire after 5 hours
  - Check system clock is correct
```

### 4. Duplicate Applications
```javascript
Problem: User can apply multiple times
Solution: FIXED - Check alreadyApplied before allowing
```

---

**End of Detailed Functionality & Workflow Documentation**

For deployment instructions, see: `DEPLOYMENT_GUIDE.md`  
For testing procedures, see: `TESTING_GUIDE.md`  
For code review items, see: `CODE_REVIEW_AND_DEPLOYMENT_FIXES.md`

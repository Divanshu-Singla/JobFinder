# JobFinder - Testing Guide

## Overview
This document provides comprehensive testing instructions for all features in the JobFinder application. Each feature includes test scenarios, expected outcomes, and validation steps.

---

## Table of Contents
1. [Testing Environment Setup](#testing-environment-setup)
2. [User Authentication Features](#user-authentication-features)
3. [Job Search & Browsing](#job-search--browsing)
4. [Job Application Process](#job-application-process)
5. [User Dashboard Features](#user-dashboard-features)
6. [Admin Authentication](#admin-authentication)
7. [Admin Dashboard Features](#admin-dashboard-features)
8. [Admin Job Management](#admin-job-management)
9. [Admin User Management](#admin-user-management)
10. [Admin Applicant Management](#admin-applicant-management)
11. [Real-time Notifications](#real-time-notifications)
12. [File Upload Features](#file-upload-features)
13. [Security Features](#security-features)

---

## Testing Environment Setup

### Prerequisites
- Node.js v14+ installed
- MongoDB Atlas connection available
- Cloudinary account configured
- Two browser windows (for testing real-time features)

### Environment Variables
**Backend (.env):**
```env
PORT=5000
MONGO_URI=mongodb+srv://user_moksh:Dlhv3r0Prc61lAue@cluster5.jkkxqdn.mongodb.net/job_portal_db
JWT_SECRET=8c4a1138ef4a8cea5f8693cb329f35cb139b0fe40b5c7ae7f1b0bc973e101e6d...
CLOUDINARY_CLOUD_NAME=dzwbq16d6
CLOUDINARY_API_KEY=618898626434114
CLOUDINARY_API_SECRET=NUZPBhDr5p4q-ez2pn9Sg2RgEfQ
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

### Starting the Application
1. **Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Expected: Server running on port 5000

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Expected: App running on http://localhost:3000

---

## User Authentication Features

### Test Case 1: User Registration

**Test Steps:**
1. Navigate to http://localhost:3000/register
2. Fill in the registration form:
   - Name: "Test User"
   - Email: "testuser@example.com"
   - Password: "Test@1234"
   - Confirm Password: "Test@1234"
3. Click "Sign Up"

**Expected Outcome:**
- ✅ Success message displayed
- ✅ Redirected to login page
- ✅ New user created in MongoDB database

**Validation Checks:**
- Password must be 8+ characters
- Password must contain uppercase, lowercase, number, special character
- Email format validation
- Name must be 2-50 characters
- Confirm password must match

**Error Scenarios to Test:**
- Weak password (< 8 chars): "Password must be at least 8 characters"
- Invalid email: "Please enter a valid email address"
- Password mismatch: "Passwords do not match"
- Duplicate email: "User already exists"

### Test Case 2: User Login

**Test Steps:**
1. Navigate to http://localhost:3000/login
2. Enter credentials:
   - Email: "testuser@example.com"
   - Password: "Test@1234"
3. Click "Sign In"

**Expected Outcome:**
- ✅ Success notification
- ✅ JWT token stored in localStorage
- ✅ Redirected to home page
- ✅ Navbar shows user avatar/name

**Error Scenarios:**
- Wrong password: "Invalid credentials"
- Unregistered email: "User not found"
- Empty fields: Validation errors shown

### Test Case 3: User Logout

**Test Steps:**
1. While logged in, click user avatar in navbar
2. Click "Logout"

**Expected Outcome:**
- ✅ JWT token removed from localStorage
- ✅ Redirected to login page
- ✅ Cannot access protected routes

---

## Job Search & Browsing

### Test Case 4: View All Jobs (Home Page)

**Test Steps:**
1. Navigate to http://localhost:3000/ (logged in or out)
2. Observe job listings

**Expected Outcome:**
- ✅ All active jobs displayed in grid layout
- ✅ Each job card shows:
  - Job title
  - Company name
  - Location
  - Salary
  - Experience required
  - Job type badge
  - "View Details" button
  - Bookmark icon (if logged in)

### Test Case 5: Search Jobs

**Test Steps:**
1. On home page, use search bar
2. Enter search terms:
   - By title: "Developer"
   - By company: "Google"
   - By location: "Bangalore"

**Expected Outcome:**
- ✅ Jobs filtered in real-time
- ✅ Results match search criteria
- ✅ "No jobs found" message if no matches

### Test Case 6: View Job Details

**Test Steps:**
1. Click "View Details" on any job card
2. Observe the job details page

**Expected Outcome:**
- ✅ Full job description displayed
- ✅ All job details visible:
  - Title, company, location, salary
  - Experience required
  - Job type
  - Full description
  - Posted date
  - Number of applicants
- ✅ "Apply Now" button (if logged in and not applied)
- ✅ "Applied" badge (if already applied)
- ✅ Bookmark button

---

## Job Application Process

### Test Case 7: Apply for Job

**Test Steps:**
1. Navigate to job details page
2. Click "Apply Now"
3. Fill application form:
   - Resume upload (PDF/DOC/DOCX, max 5MB)
   - Cover letter (optional)
   - Phone number
4. Click "Submit Application"

**Expected Outcome:**
- ✅ Success message: "Application submitted successfully"
- ✅ Button changes to "Applied"
- ✅ Resume uploaded to Cloudinary
- ✅ Application stored in database
- ✅ Real-time notification sent to admin (if online)
- ✅ User cannot apply again to same job

**Validation Checks:**
- Resume file type: Only PDF, DOC, DOCX
- File size: Maximum 5MB
- Phone number format: 10-15 digits

**Error Scenarios:**
- Invalid file type: "Only PDF, DOC, and DOCX files are allowed"
- File too large: "Document size must not exceed 5MB"
- Already applied: "You have already applied to this job"

### Test Case 8: Apply Without Resume

**Test Steps:**
1. Try to submit application without uploading resume

**Expected Outcome:**
- ✅ Error message: "Resume is required"
- ✅ Form not submitted

---

## User Dashboard Features

### Test Case 9: Access User Dashboard

**Test Steps:**
1. While logged in, click "Dashboard" in navbar
2. Navigate to http://localhost:3000/user-dashboard

**Expected Outcome:**
- ✅ User dashboard page displayed
- ✅ Profile section shows:
  - User name
  - Email
  - Profile photo
  - Member since date
- ✅ Statistics cards display:
  - Total applications
  - Pending applications
  - Accepted applications
  - Rejected applications

### Test Case 10: Update User Profile

**Test Steps:**
1. On user dashboard, find profile section
2. Click "Edit Profile" or similar button
3. Update:
   - Name: "Updated Name"
   - Profile photo (upload image)
4. Save changes

**Expected Outcome:**
- ✅ Success message: "Profile updated successfully"
- ✅ Changes reflected immediately
- ✅ Profile photo uploaded to Cloudinary
- ✅ Navbar shows updated name/photo

**Validation:**
- Image type: Only JPG, JPEG, PNG
- Image size: Maximum 2MB

### Test Case 11: View My Applications

**Test Steps:**
1. On user dashboard, navigate to "My Applications" section
2. Review all submitted applications

**Expected Outcome:**
- ✅ List of all applications displayed
- ✅ Each application shows:
  - Job title
  - Company name
  - Applied date
  - Status (Pending/Approved/Rejected)
  - Status badge with color coding
- ✅ Can click to view job details
- ✅ "No applications yet" message if empty

---

## Job Bookmarking

### Test Case 12: Bookmark a Job

**Test Steps:**
1. On home page or job details, click bookmark icon
2. Navigate to "Bookmarked Jobs" page

**Expected Outcome:**
- ✅ Bookmark icon fills/changes color
- ✅ Success message: "Job bookmarked"
- ✅ Job appears in bookmarks list
- ✅ Can view all bookmarked jobs

### Test Case 13: Remove Bookmark

**Test Steps:**
1. On bookmarked job, click bookmark icon again

**Expected Outcome:**
- ✅ Bookmark icon returns to outline
- ✅ Success message: "Bookmark removed"
- ✅ Job removed from bookmarks list

---

## Admin Authentication

### Test Case 14: Admin Login

**Test Steps:**
1. Navigate to http://localhost:3000/admin-login
2. Enter admin credentials:
   - Email: "admin@example.com" (or your admin email)
   - Password: "Admin@1234" (or your admin password)
3. Click "Sign In"

**Expected Outcome:**
- ✅ Success notification
- ✅ Admin JWT token stored in localStorage
- ✅ Redirected to admin dashboard
- ✅ Navbar shows admin interface

**Security Note:** 
⚠️ Default admin password MUST be changed after deployment

### Test Case 15: Admin Protected Routes

**Test Steps:**
1. Without logging in as admin, try to access:
   - http://localhost:3000/admin-dashboard
   - http://localhost:3000/admin-jobs
   - http://localhost:3000/admin-users

**Expected Outcome:**
- ✅ Redirected to admin login page
- ✅ Error message: "Unauthorized access"

---

## Admin Dashboard Features

### Test Case 16: View Admin Dashboard

**Test Steps:**
1. Login as admin
2. Navigate to admin dashboard

**Expected Outcome:**
- ✅ Dashboard displays statistics:
  - Total jobs posted
  - Total registered users
  - Total applications
  - Pending applications
  - Recent activity feed
- ✅ Quick action buttons:
  - Manage Jobs
  - Manage Users
  - View Applications

### Test Case 17: View Recent Activity

**Test Steps:**
1. On admin dashboard, observe activity feed

**Expected Outcome:**
- ✅ Shows recent:
  - New user registrations
  - Job applications
  - Application status changes
- ✅ Real-time updates via Socket.io

---

## Admin Job Management

### Test Case 18: View All Jobs (Admin)

**Test Steps:**
1. Navigate to http://localhost:3000/admin-jobs
2. Review jobs table

**Expected Outcome:**
- ✅ All jobs listed in table format
- ✅ Columns show:
  - Title
  - Company
  - Location
  - Salary
  - Experience
  - Number of applicants
  - Actions (View Applicants, Delete)
- ✅ Can sort and filter

### Test Case 19: Create New Job

**Test Steps:**
1. On admin jobs page, click "Create Job"
2. Fill job form:
   - Title: "Senior Full Stack Developer"
   - Company: "Tech Corp"
   - Location: "Bangalore"
   - Salary: 1500000
   - Experience: 3
   - Job Type: "Full-time"
   - Description: "Detailed job description here..."
3. Click "Create"

**Expected Outcome:**
- ✅ Success message: "Job created successfully"
- ✅ New job appears in jobs list
- ✅ Job visible to all users
- ✅ Can apply to the new job

**Validation Checks:**
- Title: 3-100 characters
- Company: 2-100 characters
- Location: 2-100 characters
- Salary: Positive number, max 100M
- Experience: 0-50 years
- Description: 10-5000 characters

**Error Scenarios:**
- Short title: "Job title must be at least 3 characters long"
- Negative salary: "Salary cannot be negative"
- Long description: "Description must not exceed 5000 characters"

### Test Case 20: Delete Job

**Test Steps:**
1. On admin jobs page, click "Delete" on a job
2. Confirm deletion in dialog

**Expected Outcome:**
- ✅ Confirmation dialog appears
- ✅ After confirm: "Job deleted successfully"
- ✅ Job removed from list
- ✅ Job no longer visible to users
- ✅ All applications for that job preserved in database

---

## Admin User Management

### Test Case 21: View All Users

**Test Steps:**
1. Navigate to http://localhost:3000/admin-users
2. Review users table

**Expected Outcome:**
- ✅ All registered users listed
- ✅ Columns show:
  - Name
  - Email
  - Joined date
  - Number of applications
  - Actions
- ✅ Can search/filter users

### Test Case 22: View User Details

**Test Steps:**
1. On admin users page, click on user
2. View user profile details

**Expected Outcome:**
- ✅ Full user information displayed:
  - Name, email, profile photo
  - Registration date
  - All applications submitted
  - Application statuses
  - Bookmarked jobs

---

## Admin Applicant Management

### Test Case 23: View Job Applicants

**Test Steps:**
1. Navigate to admin jobs page
2. Click "View Applicants" on a job with applications
3. Review applicants list

**Expected Outcome:**
- ✅ All applicants for that job displayed
- ✅ Each applicant shows:
  - Name
  - Email
  - Applied date
  - Resume download link
  - Cover letter (if provided)
  - Phone number
  - Application status
  - Actions (Approve, Reject)

### Test Case 24: Approve Application

**Test Steps:**
1. On applicants page, find pending application
2. Click "Approve" button
3. Confirm action

**Expected Outcome:**
- ✅ Success message: "Application approved"
- ✅ Status changes to "Approved"
- ✅ Status badge turns green
- ✅ Real-time notification sent to user (if online)
- ✅ User sees "Accepted" status in their dashboard

### Test Case 25: Reject Application

**Test Steps:**
1. On applicants page, find pending application
2. Click "Reject" button
3. Optionally add rejection reason
4. Confirm action

**Expected Outcome:**
- ✅ Success message: "Application rejected"
- ✅ Status changes to "Rejected"
- ✅ Status badge turns red
- ✅ Real-time notification sent to user (if online)
- ✅ User sees "Rejected" status in their dashboard

### Test Case 26: Download Applicant Resume

**Test Steps:**
1. On applicants page, click resume link
2. Resume should download/open

**Expected Outcome:**
- ✅ Resume downloads from Cloudinary CDN
- ✅ File opens correctly (PDF/DOC/DOCX)
- ✅ Fast delivery via CDN

---

## Real-time Notifications

### Test Case 27: New Application Notification (Admin)

**Setup:**
- Admin logged in on Browser 1
- User logged in on Browser 2

**Test Steps:**
1. On Browser 2 (User), apply for a job
2. On Browser 1 (Admin), observe notifications

**Expected Outcome:**
- ✅ Admin receives instant notification
- ✅ Notification shows:
  - "New application from [User Name]"
  - Job title
  - Timestamp
- ✅ Notification badge count updates
- ✅ Can click to view application

### Test Case 28: Application Status Notification (User)

**Setup:**
- User logged in on Browser 1
- Admin logged in on Browser 2

**Test Steps:**
1. On Browser 2 (Admin), approve/reject application
2. On Browser 1 (User), observe notifications

**Expected Outcome:**
- ✅ User receives instant notification
- ✅ Notification shows:
  - Application approved/rejected
  - Job title
  - Timestamp
- ✅ Dashboard statistics update in real-time
- ✅ Application status updates immediately

### Test Case 29: Socket Connection Status

**Test Steps:**
1. Open browser DevTools > Network > WS (WebSocket)
2. Login as user or admin
3. Observe WebSocket connection

**Expected Outcome:**
- ✅ Socket.io connection established
- ✅ Connection URL: ws://localhost:5000/socket.io/
- ✅ "Connected" status in console (if logging enabled)
- ✅ Reconnects automatically on disconnect

---

## File Upload Features

### Test Case 30: Upload Resume (Valid File)

**Test Steps:**
1. Apply for job with valid PDF resume
2. Upload file < 5MB
3. Submit application

**Expected Outcome:**
- ✅ File uploads to Cloudinary
- ✅ Upload progress shown (if implemented)
- ✅ Success message after upload
- ✅ Resume URL stored in database
- ✅ File accessible via Cloudinary CDN
- ✅ File organized in folder: job-portal/resumes/

**Cloudinary Verification:**
- Navigate to Cloudinary dashboard
- Check job-portal/resumes/ folder
- Verify file exists with correct name

### Test Case 31: Upload Profile Photo (Valid Image)

**Test Steps:**
1. On user dashboard, upload profile photo
2. Select JPG/PNG file < 2MB
3. Save profile

**Expected Outcome:**
- ✅ Image uploads to Cloudinary
- ✅ Automatic optimization applied (800x800, quality: auto:good)
- ✅ Success message displayed
- ✅ Photo displayed immediately
- ✅ File organized in folder: job-portal/profiles/
- ✅ Old photo replaced (not accumulated)

### Test Case 32: Upload Invalid File Type

**Test Steps:**
1. Try to upload .txt or .exe file as resume
2. Submit application

**Expected Outcome:**
- ✅ Error: "Only PDF, DOC, and DOCX files are allowed"
- ✅ Upload blocked
- ✅ Form not submitted

### Test Case 33: Upload Oversized File

**Test Steps:**
1. Try to upload resume > 5MB
2. Try to upload image > 2MB

**Expected Outcome:**
- ✅ Error: "Document size must not exceed 5MB" (resume)
- ✅ Error: "Image size must not exceed 2MB" (photo)
- ✅ Upload blocked
- ✅ User prompted to compress file

---

## Security Features

### Test Case 34: JWT Token Expiration

**Test Steps:**
1. Login as user
2. Wait for JWT expiration (check JWT_SECRET config)
3. Try to perform protected action

**Expected Outcome:**
- ✅ Token expires after configured time
- ✅ Error: "Token expired"
- ✅ Redirected to login page
- ✅ Must re-authenticate

### Test Case 35: SQL Injection Protection

**Test Steps:**
1. On login form, enter:
   - Email: `admin@example.com' OR '1'='1`
   - Password: `' OR '1'='1`
2. Submit

**Expected Outcome:**
- ✅ Login fails
- ✅ No database breach
- ✅ Input sanitized by express-mongo-sanitize

### Test Case 36: XSS Attack Prevention

**Test Steps:**
1. On job application, enter:
   - Cover letter: `<script>alert('XSS')</script>`
2. Submit application
3. Admin views application

**Expected Outcome:**
- ✅ Script tags escaped/removed
- ✅ No JavaScript execution
- ✅ Text displayed safely
- ✅ Protected by xss-clean middleware

### Test Case 37: Rate Limiting

**Test Steps:**
1. On login page, make 10+ failed login attempts rapidly
2. Continue trying to login

**Expected Outcome:**
- ✅ After limit (default 100 requests/15min), blocked
- ✅ Error: "Too many requests, try again later"
- ✅ Must wait for time window to reset
- ✅ Prevents brute force attacks

### Test Case 38: CORS Protection

**Test Steps:**
1. Open browser console
2. Try to make API request from different origin:
   ```javascript
   fetch('http://localhost:5000/api/jobs')
   ```

**Expected Outcome:**
- ✅ CORS error if origin not allowed
- ✅ Only FRONTEND_URL allowed
- ✅ Credentials (cookies) required

### Test Case 39: Helmet Security Headers

**Test Steps:**
1. Open browser DevTools > Network
2. Make any API request
3. Check response headers

**Expected Outcome:**
- ✅ Security headers present:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security (if HTTPS)

---

## Error Handling & Resilience

### Test Case 40: Network Error Handling

**Test Steps:**
1. Disconnect internet
2. Try to load jobs page
3. Try to apply for job

**Expected Outcome:**
- ✅ Error message: "Network error. Please check your internet connection."
- ✅ User-friendly error display
- ✅ No app crash
- ✅ Retry mechanism attempts reconnection (axios-retry)

### Test Case 41: API Retry Logic

**Test Steps:**
1. Simulate intermittent network
2. Make API request that fails initially

**Expected Outcome:**
- ✅ Request retried up to 3 times
- ✅ Exponential backoff between retries
- ✅ Eventually succeeds if network recovers
- ✅ Final error if all retries fail

### Test Case 42: React Error Boundary

**Test Steps:**
1. Cause React error (e.g., null reference in component)
2. Observe error handling

**Expected Outcome:**
- ✅ Error boundary catches error
- ✅ Friendly error page displayed
- ✅ "Reload Page" button shown
- ✅ Error logged to console (dev mode)
- ✅ App doesn't show white screen

### Test Case 43: Server Error (500)

**Test Steps:**
1. Cause server error (e.g., database disconnected)
2. Make API request

**Expected Outcome:**
- ✅ Error message: "Server error. Please try again later."
- ✅ No sensitive error details exposed
- ✅ Error logged on server (Winston)
- ✅ User sees friendly message

---

## Database Operations

### Test Case 44: Data Persistence

**Test Steps:**
1. Create job, apply for job, bookmark job
2. Restart server and frontend
3. Check if data persists

**Expected Outcome:**
- ✅ All data persists in MongoDB Atlas
- ✅ Jobs still visible
- ✅ Applications still present
- ✅ Bookmarks retained
- ✅ User data intact

### Test Case 45: Database Connection Failure

**Test Steps:**
1. Stop MongoDB Atlas (or use invalid connection string)
2. Start backend server
3. Try to access any endpoint

**Expected Outcome:**
- ✅ Server logs connection error
- ✅ Error: "Database connection failed"
- ✅ API returns 503 Service Unavailable
- ✅ Frontend shows appropriate error

---

## Performance Testing

### Test Case 46: Large Dataset Performance

**Test Steps:**
1. Create 100+ jobs via admin panel (or seed database)
2. Load home page
3. Scroll through jobs

**Expected Outcome:**
- ✅ Page loads within 2-3 seconds
- ✅ Smooth scrolling
- ✅ No lag or freezing
- ✅ Pagination/infinite scroll works (if implemented)

### Test Case 47: File Upload Speed

**Test Steps:**
1. Upload 5MB resume
2. Measure upload time

**Expected Outcome:**
- ✅ Upload completes within 5-10 seconds (depends on internet)
- ✅ Progress indicator shown
- ✅ Cloudinary CDN provides fast delivery

### Test Case 48: Concurrent Users

**Test Steps:**
1. Open multiple browser tabs/windows
2. Login as different users simultaneously
3. Perform actions (apply, bookmark, etc.)

**Expected Outcome:**
- ✅ All users can operate independently
- ✅ No data conflicts
- ✅ Real-time notifications work for all
- ✅ Server handles load gracefully

---

## Mobile Responsiveness

### Test Case 49: Mobile View Testing

**Test Steps:**
1. Open app on mobile device or DevTools mobile emulator
2. Test all pages: Home, Login, Register, Dashboard, Job Details

**Expected Outcome:**
- ✅ Layouts adapt to small screens
- ✅ All buttons and links clickable
- ✅ Text readable without zooming
- ✅ Forms usable on mobile
- ✅ Navbar collapses to hamburger menu
- ✅ Material-UI responsive grid works

### Test Case 50: Touch Interactions

**Test Steps:**
1. On mobile/tablet, test:
   - Swiping
   - Tapping buttons
   - Scrolling
   - Form inputs

**Expected Outcome:**
- ✅ Touch events work correctly
- ✅ No accidental clicks
- ✅ Smooth scrolling
- ✅ Keyboard appears for inputs

---

## Deployment Testing

### Test Case 51: Production Environment

**After deployment to Render & Vercel:**

**Test Steps:**
1. Access production URL
2. Test all critical flows:
   - User registration/login
   - Job application
   - Admin operations
   - File uploads
   - Real-time notifications

**Expected Outcome:**
- ✅ All features work in production
- ✅ HTTPS enabled
- ✅ Cloudinary CDN delivers files fast
- ✅ MongoDB Atlas connected
- ✅ Environment variables correct
- ✅ CORS configured for production URLs
- ✅ Socket.io works across domains

### Test Case 52: Build & Bundle

**Test Steps:**
1. Run production build:
   ```bash
   cd frontend
   npm run build
   ```
2. Check build output

**Expected Outcome:**
- ✅ Build completes without errors
- ✅ Optimized bundle created
- ✅ Code splitting applied
- ✅ Assets compressed
- ✅ Service worker generated (if PWA)

---

## Regression Testing Checklist

After any code changes, verify:

- [ ] User can register
- [ ] User can login
- [ ] Jobs display on home page
- [ ] Search works
- [ ] Job details page loads
- [ ] User can apply for job with resume
- [ ] Resume uploads to Cloudinary
- [ ] Application appears in user dashboard
- [ ] Admin can login
- [ ] Admin can create job
- [ ] Admin can view applicants
- [ ] Admin can approve/reject applications
- [ ] Real-time notifications work
- [ ] Bookmarking works
- [ ] User profile update works
- [ ] No console errors
- [ ] No security vulnerabilities
- [ ] Mobile view works

---

## Test Data & Credentials

### Test Users
```
User 1:
- Email: testuser1@example.com
- Password: Test@1234
- Name: Test User One

User 2:
- Email: testuser2@example.com
- Password: Test@5678
- Name: Test User Two
```

### Admin Credentials
```
Admin:
- Email: admin@example.com
- Password: Admin@1234
⚠️ CHANGE AFTER DEPLOYMENT
```

### Sample Jobs
```
Job 1:
- Title: Full Stack Developer
- Company: Tech Corp
- Location: Bangalore
- Salary: 1200000
- Experience: 2 years

Job 2:
- Title: Frontend Developer
- Company: WebDev Inc
- Location: Mumbai
- Salary: 800000
- Experience: 1 year

Job 3:
- Title: Backend Developer
- Company: Code Solutions
- Location: Pune
- Salary: 1000000
- Experience: 3 years
```

---

## Known Issues & Workarounds

### Issue 1: Socket.io Connection on First Load
**Problem:** Socket may not connect immediately on page load  
**Workaround:** Refresh page once after login  
**Fix:** Implement connection retry logic in SocketContext

### Issue 2: File Upload Progress
**Problem:** No upload progress indicator  
**Workaround:** Show spinner during upload  
**Fix:** Implement progress bar using Axios upload events

### Issue 3: Mobile Keyboard Overlap
**Problem:** Keyboard may overlap input fields on some devices  
**Workaround:** Scroll page manually  
**Fix:** Add viewport height adjustment on focus

---

## Automation Opportunities

Consider automating these tests with:

- **Jest + React Testing Library:** Unit tests for components
- **Cypress:** E2E tests for user flows
- **Supertest:** API endpoint tests
- **Postman/Newman:** API test suites
- **Lighthouse:** Performance and accessibility audits

---

## Testing Metrics

Track these metrics:

- ✅ **Test Coverage:** Aim for 80%+ code coverage
- ✅ **Pass Rate:** 100% of critical paths should pass
- ✅ **Bug Density:** < 1 bug per feature
- ✅ **Performance:** Page load < 3s, API response < 500ms
- ✅ **Availability:** 99%+ uptime

---

## Reporting Bugs

When reporting issues, include:

1. **Environment:** Dev/Production, Browser, OS
2. **Steps to Reproduce:** Exact sequence
3. **Expected vs Actual:** What should happen vs what happens
4. **Screenshots/Logs:** Visual evidence
5. **Severity:** Critical/High/Medium/Low
6. **User Impact:** How many users affected

---

## Sign-off Checklist

Before production deployment:

- [ ] All critical test cases pass
- [ ] No high-severity bugs
- [ ] Security features verified
- [ ] Performance acceptable
- [ ] Mobile responsiveness confirmed
- [ ] Admin password changed
- [ ] Environment variables set correctly
- [ ] Database backup created
- [ ] Monitoring/logging configured
- [ ] Documentation updated
- [ ] Stakeholder approval obtained

---

## Support & Troubleshooting

For issues during testing:

1. Check browser console for errors
2. Check backend terminal for server logs
3. Verify environment variables
4. Check MongoDB Atlas connection
5. Verify Cloudinary credentials
6. Test in incognito/private mode
7. Clear browser cache and localStorage
8. Restart backend server
9. Check network tab for failed requests
10. Review Winston logs in `backend/logs/`

---

**Last Updated:** 2025-01-XX  
**Tested By:** [Your Name]  
**Version:** 1.0.0  
**Status:** Ready for Production Testing

# 🚀 Deployment Guide - JobFinder Application

**Last Updated:** December 23, 2025  
**Status:** Production-Ready

---

## 📋 Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Post-Deployment Configuration](#post-deployment-configuration)
5. [Environment Variables Reference](#environment-variables-reference)
6. [Domain & URL Management](#domain--url-management)
7. [Troubleshooting](#troubleshooting)
8. [Important Notes About File URLs](#important-notes-about-file-urls)

---

## Pre-Deployment Checklist

### ✅ Before You Start

- [ ] **Code pushed to GitHub** (master/main branch)
- [ ] **MongoDB Atlas** configured and accessible
- [ ] **Cloudinary account** set up with credentials
- [ ] **.env files** configured locally (used as reference)
- [ ] **Backend runs locally** without errors (`npm start` in backend/)
- [ ] **Frontend runs locally** without errors (`npm start` in frontend/)
- [ ] **All dependencies installed** (node_modules present)
- [ ] **Git repository is public** or you have deployment permissions

### 🔐 Credentials Ready

Make sure you have these ready:
- MongoDB Atlas connection string
- Cloudinary: Cloud Name, API Key, API Secret
- JWT Secret (64+ character string)
- GitHub repository URL

---

## Backend Deployment (Render)

### Step 1: Create Render Account

1. Go to https://render.com/
2. Sign up with GitHub account (recommended)
3. Verify your email address

### Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
   - Grant Render access to your GitHub account
   - Select the **JobFinder-master** repository
3. Configure the service:

```
Name: jobfinder-backend (or your preferred name)
Region: Oregon (US West) - or closest to your users
Branch: master (or main)
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 3: Configure Environment Variables

In Render dashboard → Environment → Add the following environment variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database
MONGO_URI=mongodb+srv://user_moksh:Dlhv3r0Prc61lAue@cluster5.jkkxqdn.mongodb.net/job_portal_db

# JWT Secret (64+ characters)
JWT_SECRET=8c4a1138ef4a8cea5f8693cb329f35cb139b0fe40b5c7ae7f1b0bc973e101e6d8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7

# Admin Default Password (CHANGE AFTER FIRST LOGIN)
DEFAULT_ADMIN_PASSWORD=SecureAdmin@2025

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dzwbq16d6
CLOUDINARY_API_KEY=618898626434114
CLOUDINARY_API_SECRET=NUZPBhDr5p4q-ez2pn9Sg2RgEfQ

# Frontend URL (update after frontend deployment)
FRONTEND_URL=http://localhost:3000
```

**Important:** Leave `FRONTEND_URL` as localhost for now. You'll update it after deploying the frontend.

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (takes 3-5 minutes)
3. Once deployed, you'll see a URL like: `https://jobfinder-backend-xyz.onrender.com`
4. **Save this URL** - you'll need it for frontend deployment

### Step 5: Verify Backend Deployment

1. Visit `https://your-backend-url.onrender.com/`
2. You should see:
```json
{
  "name": "Job Portal API",
  "version": "1.2.0",
  "status": "running",
  "database": "connected"
}
```

3. Test API endpoint: `https://your-backend-url.onrender.com/api/jobs`
   - Should return empty array `[]` or list of jobs

### Step 6: Important Render Settings

#### Enable Auto-Deploy (Recommended)
- Settings → Auto-Deploy: **Enable**
- Now every push to master branch will auto-deploy

#### Health Check Path (Optional but Recommended)
- Settings → Health Check Path: `/`
- This keeps your service alive

#### Note: Free Tier Limitations
⚠️ **Render Free Tier:**
- Spins down after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds (cold start)
- 750 hours/month free
- Consider upgrading to Starter ($7/month) for production

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com/
2. Sign up with GitHub account (recommended)
3. Verify your email address

### Step 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your GitHub repository
3. Configure the project:

```
Project Name: jobfinder-frontend (or your preferred name)
Framework Preset: Create React App
Root Directory: frontend
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Step 3: Configure Environment Variables

Before deploying, add environment variables:

Click **"Environment Variables"** and add:

```env
# Build Configuration
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
DISABLE_ESLINT_PLUGIN=true
TSC_COMPILE_ON_ERROR=true
CI=true

# API Configuration (UPDATE WITH YOUR BACKEND URL)
REACT_APP_API_BASE_URL=https://jobfinder-backend-xyz.onrender.com/api
```

**⚠️ CRITICAL:** Replace `https://jobfinder-backend-xyz.onrender.com` with your actual Render backend URL from Step 4 above.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for build and deployment (takes 2-4 minutes)
3. Once deployed, you'll see a URL like: `https://jobfinder-frontend.vercel.app`
4. **Save this URL** - this is your production frontend URL

### Step 5: Verify Frontend Deployment

1. Visit your Vercel URL
2. You should see the JobFinder home page
3. Test login functionality
4. Check browser console for errors (F12)

---

## Post-Deployment Configuration

### Step 1: Update Backend FRONTEND_URL

Now that frontend is deployed, update the backend environment variable:

1. Go to Render dashboard → Your backend service
2. Environment → Edit `FRONTEND_URL`
3. Change from `http://localhost:3000` to your Vercel URL:
   ```
   FRONTEND_URL=https://jobfinder-frontend.vercel.app
   ```
4. Save changes
5. Backend will automatically redeploy (takes 2-3 minutes)

### Step 2: Update Vercel Environment Variable (If Backend URL Changed)

If you need to update the backend URL later:

1. Go to Vercel dashboard → Your project
2. Settings → Environment Variables
3. Edit `REACT_APP_API_BASE_URL`
4. Update the value
5. Redeploy: Deployments → Click "..." → Redeploy

### Step 3: Test End-to-End Functionality

#### Test User Flow:
1. ✅ Register new user
2. ✅ Login as user
3. ✅ Browse jobs
4. ✅ Apply for a job (upload resume)
5. ✅ View applications in dashboard
6. ✅ Bookmark a job
7. ✅ Update profile (upload photo)
8. ✅ Logout

#### Test Admin Flow:
1. ✅ Login as admin (`admin@example.com` / `Admin@1234` or your password)
2. ✅ **IMMEDIATELY change admin password** (security!)
3. ✅ View dashboard statistics
4. ✅ Create new job
5. ✅ View job applicants
6. ✅ Approve/reject applications
7. ✅ Test real-time notifications (open in two browsers)

#### Test File Uploads:
1. ✅ Upload resume (should go to Cloudinary)
2. ✅ Upload profile photo (should go to Cloudinary)
3. ✅ View uploaded files (check Cloudinary dashboard)
4. ✅ Download resume as admin

#### Test Real-time Features:
1. ✅ Open user dashboard in Browser 1
2. ✅ Open admin panel in Browser 2
3. ✅ Apply for job in Browser 1
4. ✅ Verify notification appears in Browser 2 (admin)
5. ✅ Approve application in Browser 2
6. ✅ Verify notification appears in Browser 1 (user)

### Step 4: Security Hardening

#### Change Admin Password:
1. Login as admin
2. Navigate to admin settings/profile
3. Change password from default to strong password
4. **Document the new password securely**

#### Verify Environment Variables:
- [ ] No hardcoded secrets in code
- [ ] All sensitive data in environment variables
- [ ] JWT_SECRET is 64+ characters
- [ ] Admin password is strong

#### Update MongoDB Atlas Network Access:
1. Go to MongoDB Atlas → Network Access
2. Add Render's IP addresses or use `0.0.0.0/0` (allow all)
   - For specific IPs, contact Render support for their IP ranges

---

## Environment Variables Reference

### Backend Environment Variables (Render)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | `5000` | Yes |
| `NODE_ENV` | Environment | `production` | Yes |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` | Yes |
| `JWT_SECRET` | JWT signing secret (64+ chars) | `8c4a1138...` | Yes |
| `DEFAULT_ADMIN_PASSWORD` | Initial admin password | `SecureAdmin@2025` | Yes |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `dzwbq16d6` | Yes |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `618898626434114` | Yes |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `NUZPBhDr5p4q...` | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | `https://jobfinder-frontend.vercel.app` | Yes |

### Frontend Environment Variables (Vercel)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://jobfinder-h4r1.onrender.com/api` | Yes |
| `GENERATE_SOURCEMAP` | Generate source maps | `false` | No |
| `SKIP_PREFLIGHT_CHECK` | Skip preflight check | `true` | No |
| `DISABLE_ESLINT_PLUGIN` | Disable ESLint | `true` | No |
| `TSC_COMPILE_ON_ERROR` | Compile with TS errors | `true` | No |
| `CI` | CI environment flag | `true` | No |

---

## Domain & URL Management

### Using Custom Domain (Optional)

#### For Backend (Render):
1. Render Dashboard → Settings → Custom Domain
2. Add your domain (e.g., `api.jobfinder.com`)
3. Update DNS records as instructed
4. Update `REACT_APP_API_BASE_URL` in Vercel

#### For Frontend (Vercel):
1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., `jobfinder.com`)
3. Update DNS records as instructed
4. Update `FRONTEND_URL` in Render

### URL Update Checklist After Domain Change

If you change domains, update these:

**In Render (Backend):**
- [ ] `FRONTEND_URL` environment variable

**In Vercel (Frontend):**
- [ ] `REACT_APP_API_BASE_URL` environment variable

**Then:**
- [ ] Redeploy both services
- [ ] Test all functionality
- [ ] Clear browser cache

---

## Important Notes About File URLs

### 🎯 **DO YOU NEED TO UPDATE RESUME/PHOTO LINKS AFTER DEPLOYMENT?**

**Answer: NO! The code is already configured to work automatically.**

#### How It Works:

The codebase uses **smart URL handling** that works in both development and production:

```javascript
// This code automatically adapts:
const fileUrl = user.resume.startsWith('http')
  ? user.resume  // Cloudinary URL - use as-is
  : `${process.env.REACT_APP_API_BASE_URL?.replace('/api', '')}/${user.resume}`; // Local file - prepend backend URL
```

#### What This Means:

1. **Cloudinary Files (NEW uploads):**
   - URL stored: `https://res.cloudinary.com/dzwbq16d6/image/upload/v123/resume.pdf`
   - Works everywhere - direct CDN link
   - No changes needed after deployment ✅

2. **Local Files (OLD uploads from before Cloudinary):**
   - URL stored: `uploads/resumes/resume-123.pdf`
   - Development: Uses `http://localhost:5000/uploads/...`
   - Production: Uses `https://your-backend.onrender.com/uploads/...`
   - **Automatically switches based on `REACT_APP_API_BASE_URL`** ✅

#### Configuration Summary:

**Development (.env):**
```env
REACT_APP_API_BASE_URL=http://localhost:5000/api
```

**Production (.env on Vercel):**
```env
REACT_APP_API_BASE_URL=https://jobfinder-backend-xyz.onrender.com/api
```

**Result:**
- Development: `http://localhost:5000/uploads/resumes/file.pdf`
- Production: `https://jobfinder-backend-xyz.onrender.com/uploads/resumes/file.pdf`

#### No Code Changes Required! 🎉

Just update the environment variable on Vercel with your Render backend URL, and everything works automatically.

---

## Troubleshooting

### Backend Issues

#### Issue: "Database connection failed"
**Solution:**
1. Check MongoDB Atlas → Network Access
2. Add `0.0.0.0/0` to allow all IPs
3. Verify `MONGO_URI` is correct in Render environment variables
4. Check MongoDB Atlas cluster is running (not paused)

#### Issue: "CORS error" in browser console
**Solution:**
1. Verify `FRONTEND_URL` in Render matches your Vercel URL
2. Must include protocol: `https://` (not `http://` for production)
3. No trailing slash: ✅ `https://jobfinder.vercel.app` ❌ `https://jobfinder.vercel.app/`
4. Redeploy backend after changing

#### Issue: "Cold start - 30+ seconds to respond"
**Explanation:**
- Render free tier spins down after 15 minutes inactive
- First request wakes it up (30-60 seconds)
- Subsequent requests are fast

**Solutions:**
- Upgrade to paid tier ($7/month Starter plan)
- Use external monitoring service to ping every 10 minutes (e.g., UptimeRobot)
- Accept the cold start (common for free tier)

#### Issue: "JWT token invalid" errors
**Solution:**
1. Make sure `JWT_SECRET` is the same 64+ character string on Render
2. Don't change JWT_SECRET after users have logged in (invalidates tokens)
3. Clear browser localStorage and re-login

#### Issue: "File upload failed" or "Cloudinary error"
**Solution:**
1. Verify all Cloudinary environment variables are correct
2. Check Cloudinary dashboard - account not suspended
3. Verify file size limits (5MB resume, 2MB images)
4. Check Cloudinary logs for errors

### Frontend Issues

#### Issue: "API request failed" or network errors
**Solution:**
1. Verify `REACT_APP_API_BASE_URL` points to correct backend URL
2. Check if backend is running (visit backend URL directly)
3. Open browser DevTools → Network tab to see exact error
4. Verify backend URL ends with `/api`

#### Issue: Build fails on Vercel
**Solution:**
1. Check build logs for specific error
2. Common issues:
   - Missing dependencies → Add to `package.json`
   - TypeScript errors → Set `TSC_COMPILE_ON_ERROR=true`
   - ESLint errors → Set `DISABLE_ESLINT_PLUGIN=true`
   - Memory issues → Contact Vercel support

#### Issue: Environment variables not working
**Solution:**
1. Environment variables must start with `REACT_APP_` for Create React App
2. After adding/changing env vars in Vercel, **must redeploy**
3. Clear browser cache after redeploying
4. Check Vercel → Settings → Environment Variables → make sure they're set for "Production"

#### Issue: "Socket.io connection failed"
**Solution:**
1. Check browser console for exact error
2. Verify backend is running and accessible
3. Check that Socket.io is enabled on backend
4. Verify CORS settings allow WebSocket connections
5. Some corporate firewalls block WebSockets - test on mobile data

#### Issue: Old files (resume/photos) not loading
**Solution:**
1. Verify backend serves `/uploads` directory (static files enabled)
2. Check that files exist in backend `uploads/` folder
3. Render free tier has ephemeral filesystem - files deleted on restart
4. **Solution:** Migrate to Cloudinary (all new uploads already use Cloudinary)
5. Old files need to be manually uploaded to Cloudinary or left on backup

### General Issues

#### Issue: "Module not found" errors
**Solution:**
1. Make sure all dependencies are in `package.json`
2. Delete `node_modules` and run `npm install`
3. Check for typos in import statements
4. Verify file paths are correct (case-sensitive on Linux)

#### Issue: Performance is slow
**Solutions:**
1. Enable compression on backend (already implemented with Helmet)
2. Use Cloudinary for images (automatic CDN)
3. Upgrade Render to paid tier for better performance
4. Add database indexes (check MongoDB Atlas)
5. Enable caching where appropriate

---

## Deployment Checklist

### Pre-Deployment
- [x] Code tested locally
- [x] Environment variables documented
- [x] MongoDB Atlas configured
- [x] Cloudinary configured
- [x] Code pushed to GitHub

### Backend Deployment (Render)
- [ ] Web service created on Render
- [ ] GitHub repository connected
- [ ] Build and start commands configured
- [ ] All environment variables added
- [ ] Deployed successfully
- [ ] Backend URL working
- [ ] API endpoints responding
- [ ] Database connected

### Frontend Deployment (Vercel)
- [ ] Project imported on Vercel
- [ ] Build configuration set
- [ ] Environment variables added (with backend URL)
- [ ] Deployed successfully
- [ ] Frontend URL working
- [ ] Can reach login page
- [ ] No console errors

### Post-Deployment
- [ ] Updated `FRONTEND_URL` on Render
- [ ] Backend redeployed with new FRONTEND_URL
- [ ] Tested user registration
- [ ] Tested user login
- [ ] Tested job application (file upload)
- [ ] Tested admin login
- [ ] **CHANGED ADMIN PASSWORD** ⚠️
- [ ] Tested admin job creation
- [ ] Tested real-time notifications
- [ ] Verified Cloudinary uploads working
- [ ] Checked MongoDB Atlas for new data
- [ ] Tested on mobile device
- [ ] Cleared browser cache and retested

### Security
- [ ] Admin password changed from default
- [ ] JWT_SECRET is 64+ characters
- [ ] No secrets in GitHub repository
- [ ] MongoDB Atlas network access configured
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Render/Vercel)

---

## Support & Resources

### Documentation
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Cloudinary Docs:** https://cloudinary.com/documentation

### Monitoring & Analytics
- **Render Logs:** Dashboard → Your Service → Logs
- **Vercel Logs:** Dashboard → Your Project → Deployments → View Function Logs
- **MongoDB Atlas Monitoring:** Atlas Dashboard → Metrics
- **Cloudinary Usage:** Cloudinary Dashboard → Analytics

### Cost Monitoring
- **Render:** Dashboard → Billing (750 hours/month free)
- **Vercel:** Dashboard → Usage (100GB bandwidth free)
- **MongoDB Atlas:** Free M0 cluster (512MB storage)
- **Cloudinary:** Free tier (25GB storage, 25GB bandwidth)

---

## Next Steps After Deployment

1. **Set Up Monitoring:**
   - Add UptimeRobot or similar to ping backend every 10 minutes
   - Set up error tracking (e.g., Sentry)

2. **Backup Strategy:**
   - Regular MongoDB Atlas backups (automatic on paid tiers)
   - Export important data periodically

3. **Performance Optimization:**
   - Monitor slow queries in MongoDB Atlas
   - Add database indexes as needed
   - Consider upgrading to paid tiers for better performance

4. **SEO (Optional):**
   - Add meta tags to frontend
   - Create sitemap.xml
   - Submit to Google Search Console

5. **Analytics (Optional):**
   - Add Google Analytics
   - Track user behavior
   - Monitor conversion rates

---

## 🎉 Congratulations!

Your JobFinder application is now live in production!

**Production URLs:**
- Frontend: `https://your-frontend.vercel.app`
- Backend: `https://your-backend.onrender.com`

**Share your application:**
- Test thoroughly before sharing
- Share the frontend URL (Vercel) with users
- Monitor for errors in first few days
- Be responsive to user feedback

---

**Last Updated:** December 23, 2025  
**Version:** 1.0.0  
**Deployment Status:** ✅ Production-Ready

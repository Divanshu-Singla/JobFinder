# Security Hardening - Setup Guide

## ⚡ Quick Start (5 Minutes)

### 1. Install New Dependencies
```powershell
cd backend
npm install
```

This installs:
- `helmet` - Security headers
- `express-rate-limit` - DDoS protection
- `express-mongo-sanitize` - NoSQL injection prevention
- `xss-clean` - XSS protection
- `winston` - Production logging

### 2. Generate Secure JWT Secret
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output (64 character hex string).

### 3. Update Your .env File
```env
# Replace this line:
JWT_SECRET=your_jwt_secret_key_here

# With your generated secret:
JWT_SECRET=<paste-the-64-char-hex-here>
```

### 4. Change Default Admin Password
```env
# Replace this:
DEFAULT_ADMIN_PASSWORD=Prince@2498

# With something secure:
DEFAULT_ADMIN_PASSWORD=YourSecurePassword@2025
```

### 5. Run Security Tests
```powershell
npm test
```

You should see:
```
✅ All critical security checks passed!
```

### 6. Start the Server
```powershell
npm start
```

You'll now see:
- Colorized Winston logs
- Security middleware loaded
- Rate limiting active

---

## 🔍 What Changed?

### Security Improvements
✅ **Helmet** - Protects against common attacks (XSS, clickjacking)  
✅ **Rate Limiting** - Max 100 requests/15min, 5 login attempts/15min  
✅ **NoSQL Injection Prevention** - Sanitizes MongoDB queries  
✅ **XSS Protection** - Cleans malicious scripts from input  
✅ **File Signature Verification** - Detects fake file types  
✅ **Error Handling** - No stack traces leaked to users  
✅ **Production Logging** - Winston with file rotation  

### Architecture Improvements
✅ **Constants File** - No more magic numbers  
✅ **Database Retry Logic** - 5 attempts with exponential backoff  
✅ **Environment Separation** - .env.development vs .env.production  
✅ **Deployment Configs** - Ready for Render + Vercel  

---

## 📋 Pre-Deployment Checklist

Before deploying to production:

- [ ] Run `npm install` in backend
- [ ] Run `npm test` - all tests pass
- [ ] Generated new JWT_SECRET (64 chars)
- [ ] Changed DEFAULT_ADMIN_PASSWORD
- [ ] Set up MongoDB Atlas account
- [ ] Updated MONGO_URI in .env.production
- [ ] Reviewed logs directory (.gitignore excludes it)
- [ ] Tested health endpoint: `http://localhost:5000/api/health`

---

## 🚀 Deployment

### MongoDB Atlas (Free Tier)
1. Go to https://mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Add user and get connection string
4. Whitelist IP: 0.0.0.0/0 (Render) or specific IPs

### Backend to Render
1. Push code to GitHub
2. Create Web Service on Render.com
3. Set environment variables in dashboard
4. Deploy (auto-deploys on push)

### Frontend to Vercel
1. Update `frontend/vercel.json` with backend URL
2. Run `vercel --prod` or connect GitHub repo
3. Deploy

See [PROJECT_STATE.md - Deployment Notes](#deployment-notes) for detailed steps.

---

## 🧪 Testing

### Test Rate Limiting
```powershell
# Try 6 login attempts (should block on 6th)
for ($i=1; $i -le 6; $i++) {
    curl -X POST http://localhost:5000/api/auth/login `
      -H "Content-Type: application/json" `
      -d '{"email":"test@test.com","password":"wrong"}' | Write-Output "Attempt $i"
}
```

### Test File Upload Validation
Try uploading a text file renamed as .pdf - should be rejected with:
```json
{
  "msg": "File validation failed. File type does not match its content."
}
```

### Check Logs
```powershell
# View error logs
type backend\logs\error.log

# View all logs
type backend\logs\combined.log
```

---

## 🔧 Troubleshooting

**Error: Cannot find module 'helmet'**
```powershell
cd backend
npm install
```

**Error: logs directory not found**
- This is normal on first run
- Winston creates it automatically
- Directory is in .gitignore

**Security test fails**
```powershell
# Check which test failed
npm test

# Common fixes:
# 1. JWT_SECRET too short - regenerate (64 chars)
# 2. Default password still set - change in .env
# 3. Missing dependencies - run npm install
```

---

## 📚 Learn More

- **Full Documentation**: See `PROJECT_STATE.md`
- **Security Details**: Section 7 - Security Hardening
- **Deployment Guide**: Section 15 - Deployment Notes
- **Constants Reference**: `backend/config/constants.js`
- **Logger Usage**: `backend/config/logger.js`

---

## ⏱️ Time Investment

| Task | Time |
|------|------|
| npm install | 2 min |
| Generate JWT secret | 30 sec |
| Update .env | 1 min |
| Run tests | 30 sec |
| Review changes | 5 min |
| **Total** | **~10 min** |

---

**Questions?** Check PROJECT_STATE.md or run `npm test` to validate your setup.

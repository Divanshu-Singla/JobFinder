// backend/test-security.js
// Security validation test script
// Run with: npm test

const fs = require('fs');
const path = require('path');

console.log('\n🔒 Security Configuration Test\n');
console.log('='.repeat(50));

let passed = 0;
let failed = 0;

// Test 1: Check if security dependencies are installed
console.log('\n📦 Test 1: Security Dependencies');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['helmet', 'express-rate-limit', 'express-mongo-sanitize', 'xss-clean', 'winston'];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`  ✅ ${dep} installed`);
      passed++;
    } else {
      console.log(`  ❌ ${dep} NOT installed`);
      failed++;
    }
  });
} catch (err) {
  console.log(`  ❌ Failed to read package.json: ${err.message}`);
  failed++;
}

// Test 2: Check if .env.example exists and doesn't contain secrets
console.log('\n📄 Test 2: Environment Template');
try {
  const envExample = fs.readFileSync('.env.example', 'utf8');
  
  if (envExample.includes('CHANGE_THIS')) {
    console.log('  ✅ .env.example contains placeholder values');
    passed++;
  } else {
    console.log('  ⚠️  .env.example may contain actual values');
    failed++;
  }
  
  if (!envExample.includes('Prince@2498')) {
    console.log('  ✅ Hardcoded password removed from template');
    passed++;
  } else {
    console.log('  ❌ Hardcoded password still in template');
    failed++;
  }
} catch (err) {
  console.log(`  ❌ .env.example not found`);
  failed++;
}

// Test 3: Check if actual .env has secure values
console.log('\n🔐 Test 3: Environment Security');
try {
  const env = fs.readFileSync('.env', 'utf8');
  
  if (env.includes('your_jwt_secret_key_here') || env.includes('CHANGE_THIS')) {
    console.log('  ❌ .env still contains default JWT_SECRET');
    failed++;
  } else if (env.match(/JWT_SECRET=.{32,}/)) {
    console.log('  ✅ JWT_SECRET appears to be set (32+ chars)');
    passed++;
  } else {
    console.log('  ⚠️  JWT_SECRET may be too short');
    failed++;
  }
  
  if (env.includes('Prince@2498')) {
    console.log('  ❌ Default admin password still in use');
    failed++;
  } else {
    console.log('  ✅ Default admin password changed');
    passed++;
  }
} catch (err) {
  console.log('  ⚠️  .env file not found (create from .env.example)');
  failed++;
}

// Test 4: Check if logs directory exists
console.log('\n📝 Test 4: Logging Configuration');
if (fs.existsSync('logs')) {
  console.log('  ✅ logs/ directory exists');
  passed++;
} else {
  console.log('  ⚠️  logs/ directory not found (will be created on first run)');
}

if (fs.existsSync('config/logger.js')) {
  console.log('  ✅ Logger configuration exists');
  passed++;
} else {
  console.log('  ❌ Logger configuration missing');
  failed++;
}

// Test 5: Check if constants file exists
console.log('\n⚙️  Test 5: Configuration Constants');
if (fs.existsSync('config/constants.js')) {
  console.log('  ✅ Constants configuration exists');
  passed++;
  
  try {
    const constants = require('./config/constants');
    if (constants.BCRYPT_SALT_ROUNDS === 10) {
      console.log('  ✅ Bcrypt salt rounds configured');
      passed++;
    }
    if (constants.MAX_FILE_SIZE) {
      console.log('  ✅ File size limits configured');
      passed++;
    }
    if (constants.RATE_LIMIT_MAX_REQUESTS) {
      console.log('  ✅ Rate limiting configured');
      passed++;
    }
  } catch (err) {
    console.log(`  ❌ Error loading constants: ${err.message}`);
    failed++;
  }
} else {
  console.log('  ❌ Constants configuration missing');
  failed++;
}

// Test 6: Check error middleware
console.log('\n🛡️  Test 6: Error Handling');
if (fs.existsSync('middleware/errorMiddleware.js')) {
  console.log('  ✅ Error middleware exists');
  passed++;
} else {
  console.log('  ❌ Error middleware missing');
  failed++;
}

// Test 7: Check upload middleware security
console.log('\n📤 Test 7: File Upload Security');
try {
  const uploadMiddleware = fs.readFileSync('middleware/uploadMiddleware.js', 'utf8');
  
  if (uploadMiddleware.includes('verifyFileSignature')) {
    console.log('  ✅ File signature verification implemented');
    passed++;
  } else {
    console.log('  ❌ File signature verification missing');
    failed++;
  }
  
  if (uploadMiddleware.includes('FILE_SIGNATURES')) {
    console.log('  ✅ Magic number validation configured');
    passed++;
  } else {
    console.log('  ⚠️  Magic number validation may be missing');
    failed++;
  }
} catch (err) {
  console.log(`  ❌ Upload middleware check failed: ${err.message}`);
  failed++;
}

// Test 8: Check server.js security middleware
console.log('\n🚀 Test 8: Server Security Middleware');
try {
  const server = fs.readFileSync('server.js', 'utf8');
  
  const securityChecks = [
    { name: 'helmet', pattern: /require.*helmet/ },
    { name: 'rate-limit', pattern: /require.*express-rate-limit/ },
    { name: 'mongo-sanitize', pattern: /require.*express-mongo-sanitize/ },
    { name: 'xss-clean', pattern: /require.*xss-clean/ },
    { name: 'error handler', pattern: /errorHandler/ }
  ];
  
  securityChecks.forEach(check => {
    if (check.pattern.test(server)) {
      console.log(`  ✅ ${check.name} middleware configured`);
      passed++;
    } else {
      console.log(`  ❌ ${check.name} middleware NOT configured`);
      failed++;
    }
  });
} catch (err) {
  console.log(`  ❌ Server check failed: ${err.message}`);
  failed++;
}

// Test 9: Check deployment configs
console.log('\n🚢 Test 9: Deployment Configuration');
if (fs.existsSync('render.yaml')) {
  console.log('  ✅ Render deployment config exists');
  passed++;
} else {
  console.log('  ⚠️  Render deployment config missing');
}

if (fs.existsSync('../frontend/vercel.json')) {
  console.log('  ✅ Vercel deployment config exists');
  passed++;
} else {
  console.log('  ⚠️  Vercel deployment config missing');
}

// Test 10: Check .gitignore
console.log('\n🙈 Test 10: Git Security');
try {
  const gitignore = fs.readFileSync('../.gitignore', 'utf8');
  
  if (gitignore.includes('.env') && !gitignore.includes('!.env.example')) {
    console.log('  ✅ .env files ignored by git');
    passed++;
  } else {
    console.log('  ❌ .env may not be properly ignored');
    failed++;
  }
  
  if (gitignore.includes('logs/') || gitignore.includes('*.log')) {
    console.log('  ✅ Log files ignored by git');
    passed++;
  } else {
    console.log('  ⚠️  Log files may not be ignored');
  }
} catch (err) {
  console.log('  ⚠️  .gitignore check failed');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('\n📊 Test Summary');
console.log(`  ✅ Passed: ${passed}`);
console.log(`  ❌ Failed: ${failed}`);
console.log(`  Total Tests: ${passed + failed}\n`);

if (failed === 0) {
  console.log('🎉 All critical security checks passed!');
  console.log('\n⚠️  Manual Checks Required:');
  console.log('  1. Generate strong JWT_SECRET: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  console.log('  2. Change DEFAULT_ADMIN_PASSWORD in .env');
  console.log('  3. Set up MongoDB Atlas for production');
  console.log('  4. Update FRONTEND_URL in render.yaml');
  console.log('  5. Run: npm install (to install new dependencies)\n');
  process.exit(0);
} else {
  console.log('⚠️  Some security checks failed. Review and fix before deploying.\n');
  process.exit(1);
}

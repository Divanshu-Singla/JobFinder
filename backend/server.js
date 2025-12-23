// Import required dependencies
const express = require('express');
const http = require('http');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const logger = require('./config/logger');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const constants = require('./config/constants');
const { initializeSocket } = require('./config/socket');
require('dotenv').config();

// Initialize Express application
const app = express();

// Create HTTP server (required for Socket.io)
const server = http.createServer(app);

// Connect to MongoDB Database
connectDB();

// Seed Default Admin on server start
const seedAdmin = require('./config/seed');
seedAdmin();

// CORS Configuration (MUST be before rate limiting)
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for API-only backend
  crossOriginEmbedderPolicy: false
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: constants.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: constants.RATE_LIMIT_WINDOW_MS,
  max: constants.AUTH_RATE_LIMIT_MAX,
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/admin/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data Sanitization against XSS
app.use(xss());

// Body parser with size limits
app.use(express.json({ limit: constants.JSON_BODY_LIMIT }));
app.use(express.urlencoded({ extended: true, limit: constants.JSON_BODY_LIMIT }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint - API information
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Job Portal API',
    version: '1.2.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      jobs: '/api/jobs',
      users: '/api/users',
      admin: '/api/admin'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString() 
  });
});

// API Routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/admin', require('./routes/api/admin'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/jobs', require('./routes/api/jobs'));

// 404 handler - must be after all routes
app.use(notFound);

// Error handler - must be last
app.use(errorHandler);

// Initialize Socket.io
initializeSocket(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  logger.info(`Server started on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  logger.info('Socket.io server ready for connections');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
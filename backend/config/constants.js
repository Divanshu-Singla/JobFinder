// backend/config/constants.js
// Centralized configuration constants

module.exports = {
  // Security
  BCRYPT_SALT_ROUNDS: 10,
  JWT_EXPIRATION: '5h',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100, // max 100 requests per window per IP
  AUTH_RATE_LIMIT_MAX: 5, // max 5 login attempts per window

  // File Upload Limits
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_PROFILE_PHOTO_SIZE: 2 * 1024 * 1024, // 2MB
  MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB

  // Allowed File Types
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
  ALLOWED_RESUME_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],

  // File Signatures (Magic Numbers) for validation
  FILE_SIGNATURES: {
    'image/jpeg': [0xFF, 0xD8, 0xFF],
    'image/png': [0x89, 0x50, 0x4E, 0x47],
    'application/pdf': [0x25, 0x50, 0x44, 0x46] // %PDF
  },

  // Database
  DB_RETRY_ATTEMPTS: 5,
  DB_RETRY_DELAY_MS: 5000, // 5 seconds initial delay
  DB_CONNECTION_TIMEOUT_MS: 10000, // 10 seconds

  // API
  REQUEST_TIMEOUT_MS: 30000, // 30 seconds
  JSON_BODY_LIMIT: '10mb',

  // Pagination
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,

  // Status Values
  APPLICATION_STATUS: {
    PENDING: 'Pending',
    ACCEPTED: 'Accepted',
    REJECTED: 'Rejected'
  },

  JOB_TYPES: {
    FULL_TIME: 'Full-time',
    PART_TIME: 'Part-time',
    CONTRACT: 'Contract',
    INTERNSHIP: 'Internship'
  },

  GENDER_OPTIONS: ['Male', 'Female', 'Other'],

  // Error Messages
  ERROR_MESSAGES: {
    UNAUTHORIZED: 'No token, authorization denied',
    INVALID_TOKEN: 'Token is not valid',
    ADMIN_NOT_FOUND: 'Admin not found, authorization denied',
    NOT_ADMIN_TOKEN: 'Not an admin token',
    DEFAULT_ADMIN_REQUIRED: 'Access denied. Default admin privilege required.',
    SERVER_ERROR: 'Server error occurred',
    VALIDATION_FAILED: 'Validation failed',
    INVALID_CREDENTIALS: 'Invalid credentials',
    USER_EXISTS: 'User already exists',
    ADMIN_EXISTS: 'Admin already exists',
    RESOURCE_NOT_FOUND: 'Resource not found'
  }
};

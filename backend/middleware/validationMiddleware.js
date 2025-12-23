// backend/middleware/validationMiddleware.js

const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// ========== AUTH VALIDATIONS ==========

// User Registration Validation
const validateUserRegistration = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  validate
];

// User Login Validation
const validateUserLogin = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

// Admin Login Validation
const validateAdminLogin = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  validate
];

// ========== JOB VALIDATIONS ==========

// Job Creation/Update Validation
const validateJob = [
  body('title')
    .notEmpty().withMessage('Job title is required')
    .isLength({ min: 3, max: 100 }).withMessage('Job title must be between 3 and 100 characters'),
  
  body('description')
    .notEmpty().withMessage('Job description is required')
    .isLength({ max: 5000 }).withMessage('Job description cannot exceed 5000 characters'),
  
  body('companyName')
    .notEmpty().withMessage('Company name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Company name must be between 2 and 100 characters'),
  
  body('location')
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 2, max: 100 }).withMessage('Location must be between 2 and 100 characters'),
  
  body('salary')
    .notEmpty().withMessage('Salary is required')
    .isInt({ min: 0, max: 100000000 }).withMessage('Salary must be a valid positive number'),
  
  body('experienceRequired')
    .notEmpty().withMessage('Experience requirement is required')
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
  
  validate
];

// Job ID Parameter Validation
const validateJobId = [
  param('id')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid Job ID format'),
  
  validate
];

// Job Query Filters Validation
const validateJobFilters = [
  query('experience')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
  
  query('salary')
    .optional()
    .isInt({ min: 0 }).withMessage('Salary must be a positive number'),
  
  validate
];

// ========== USER PROFILE VALIDATIONS ==========

// User Profile Update Validation
const validateUserProfile = [
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
  
  body('gender')
    .optional()
    .isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('Experience must be between 0 and 50 years'),
  
  body('description')
    .optional()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  
  validate
];

// ========== ADMIN VALIDATIONS ==========

// Add Admin Validation
const validateAddAdmin = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 30 }).withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  validate
];

// Admin ID Parameter Validation
const validateAdminId = [
  param('id')
    .notEmpty().withMessage('Admin ID is required')
    .isMongoId().withMessage('Invalid Admin ID format'),
  
  validate
];

// Job ID for Applicants Validation
const validateJobIdForApplicants = [
  param('jobId')
    .notEmpty().withMessage('Job ID is required')
    .isMongoId().withMessage('Invalid Job ID format'),
  
  validate
];

module.exports = {
  validate,
  validateUserRegistration,
  validateUserLogin,
  validateAdminLogin,
  validateJob,
  validateJobId,
  validateJobFilters,
  validateUserProfile,
  validateAddAdmin,
  validateAdminId,
  validateJobIdForApplicants
};

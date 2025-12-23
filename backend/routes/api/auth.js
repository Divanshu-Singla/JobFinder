// backend/routes/api/auth.js

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin } = require('../../controllers/authController');
const { 
  validateUserRegistration, 
  validateUserLogin, 
  validateAdminLogin 
} = require('../../middleware/validationMiddleware');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUserRegistration, registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token (User Login)
// @access  Public
router.post('/login', validateUserLogin, loginUser);

// @route   POST api/auth/admin/login
// @desc    Authenticate admin & get token (Admin Login)
// @access  Public
router.post('/admin/login', validateAdminLogin, loginAdmin);

module.exports = router;
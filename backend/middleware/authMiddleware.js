// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Middleware to protect user routes
exports.authUser = (req, res, next) => {
  // Get token from header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // The header format is "Bearer <token>"
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user from payload to the request object
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Middleware to protect admin routes
exports.authAdmin = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the payload contains an admin property
    if (!decoded.admin) {
        return res.status(401).json({ msg: 'Not an admin token' });
    }

    // Find the admin in DB to ensure they still exist
    const admin = await Admin.findById(decoded.admin.id).select('-password');
    if (!admin) {
        return res.status(401).json({ msg: 'Admin not found, authorization denied' });
    }

    // Attach admin from payload to the request object
    req.admin = admin; // Attach the full admin object
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};


// Middleware to check if the admin is the default admin
// This should be used AFTER authAdmin
exports.isDefaultAdmin = (req, res, next) => {
    // req.admin is attached by the authAdmin middleware
    if (req.admin && req.admin.isDefault) {
        next();
    } else {
        res.status(403).json({ msg: 'Access denied. Default admin privilege required.' });
    }
};
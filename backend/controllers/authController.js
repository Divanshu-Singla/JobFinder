// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

// === User Registration ===
exports.registerUser = async (req, res) => {
  const { name, email, password, gender } = req.body;

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user instance
    user = new User({
      name,
      email,
      password,
      gender,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Registration error:', err.message);
    console.error('Error stack:', err.stack);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ msg: 'Invalid data: ' + err.message });
    }
    res.status(500).json({ msg: 'Server error during registration' });
  }
};

// === User Login ===
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create payload
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('User login error:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: 'Server error during login', error: err.message });
  }
};

// --- Admin Login ---
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if admin exists
    let admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create payload, including admin flag and default status
    const payload = {
      admin: {
        id: admin.id,
        isDefault: admin.isDefault,
      },
    };

    // Sign and return token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
const mongoose = require('mongoose');
const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isDefault: { type: Boolean, default: false } // To identify the root admin
});

// Indexes for performance optimization (username already has unique index from schema)
adminSchema.index({ isDefault: 1 }); // For finding default admin quickly

module.exports = mongoose.model('Admin', adminSchema);
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  experience: { type: Number, required: true, default: 0 }, // in years
  skills: [{ type: String }],
  description: { type: String },
  profilePhoto: { type: String }, // Path to the file
  resume: { type: String }, // Path to the file
  appliedJobs: [{ 
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    appliedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['Pending', 'Accepted', 'Rejected'], 
      default: 'Pending' 
    }
  }],
  bookmarkedJobs: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Job' 
  }]
});

// Indexes for performance optimization (email already has unique index from schema)
userSchema.index({ experience: 1 }); // For filtering users by experience
userSchema.index({ createdAt: -1 }); // If you add timestamps later

module.exports = mongoose.model('User', userSchema);
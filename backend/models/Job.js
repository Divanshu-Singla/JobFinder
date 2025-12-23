const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: Number, required: true },
  experienceRequired: { type: Number, required: true }, // 0 for freshers
  jobType: { 
    type: String, 
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  requirements: [{ type: String }],
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  applicants: [{ 
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appliedAt: { type: Date, default: Date.now },
    status: { 
      type: String, 
      enum: ['Pending', 'Accepted', 'Rejected'], 
      default: 'Pending' 
    }
  }]
}, { timestamps: true });

// Indexes for performance optimization
jobSchema.index({ createdAt: -1 }); // For sorting by newest jobs first
jobSchema.index({ experienceRequired: 1 }); // For filtering by experience
jobSchema.index({ salary: 1 }); // For filtering by salary
jobSchema.index({ title: 'text', companyName: 'text', location: 'text' }); // Text search capability
jobSchema.index({ experienceRequired: 1, salary: 1 }); // Compound index for common filter combination
jobSchema.index({ postedBy: 1, createdAt: -1 }); // For admin to see their posted jobs

module.exports = mongoose.model('Job', jobSchema);
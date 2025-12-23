// backend/controllers/adminController.js

const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Job = require('../models/Job');
const { notifyUser, notifyAllAdmins, notifyAllUsers } = require('../config/socket');

// --- Dashboard Stats ---

exports.getStats = async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    
    // Count total applications across all jobs
    const jobs = await Job.find();
    const totalApplications = jobs.reduce((sum, job) => sum + job.applicants.length, 0);
    
    res.json({
      totalAdmins,
      totalUsers,
      totalJobs,
      totalApplications
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Admin Management ---

exports.addAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    let admin = await Admin.findOne({ username });
    if (admin) {
      return res.status(400).json({ msg: 'Admin with this username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    admin = new Admin({ username, password: hashedPassword });
    await admin.save();
    res.status(201).json({ msg: 'Admin created successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ msg: 'Admin not found' });
    }
    // Prevent default admin from being deleted
    if (admin.isDefault) {
      return res.status(400).json({ msg: 'Cannot delete the default admin' });
    }
    await admin.deleteOne();
    res.json({ msg: 'Admin removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().select('-password');
    res.json(admins);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- User Management ---

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    await user.deleteOne();
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// --- Job & Applicant Management ---

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.postJob = async (req, res) => {
  const { title, description, companyName, location, salary, experienceRequired } = req.body;
  try {
    const newJob = new Job({
      title,
      description,
      companyName,
      location,
      salary,
      experienceRequired,
      postedBy: req.admin.id,
    });
    const job = await newJob.save();
    
    // Notify all users about new job posting
    notifyAllUsers('new-job-posted', {
      jobId: job._id,
      title: job.title,
      companyName: job.companyName,
      location: job.location,
      salary: job.salary,
      message: `New job posted: ${job.title} at ${job.companyName}`,
    });
    
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    // Store job details for notification before deletion
    const jobDetails = {
      jobId: job._id.toString(),
      title: job.title,
      companyName: job.companyName,
    };
    
    await job.deleteOne();
    
    // Notify all users that job was deleted
    notifyAllUsers('job-deleted', {
      ...jobDetails,
      message: `Job removed: ${jobDetails.title} at ${jobDetails.companyName}`,
    });
    
    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateJob = async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        
        job = await Job.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId).populate('applicants.userId', '-password');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    
    // Map applicants with their status, filtering out null/deleted users
    const applicantsWithStatus = job.applicants
      .filter(app => app.userId && app.userId._id)
      .map(app => ({
        _id: app._id,
        name: app.userId.name,
        email: app.userId.email,
        phone: app.userId.phone,
        gender: app.userId.gender,
        experience: app.userId.experience,
        skills: app.userId.skills,
        description: app.userId.description,
        profilePhoto: app.userId.profilePhoto,
        resume: app.userId.resume,
        status: app.status,
        appliedAt: app.appliedAt
      }));
    
    // Return job info and applicants
    res.json({
      job: {
        _id: job._id,
        title: job.title,
        companyName: job.companyName,
        location: job.location,
        salary: job.salary,
        description: job.description
      },
      applicants: applicantsWithStatus
    });
  } catch (err) {
    console.error('Error in getJobApplicants:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// === Application Status Management ===

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['Pending', 'Accepted', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status value', validStatuses });
    }

    // Find the job and update the specific applicant's status
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Find the applicant in the job's applicants array
    const applicant = job.applicants.id(applicantId);
    if (!applicant) {
      return res.status(404).json({ msg: 'Applicant not found' });
    }

    // Update the status in job's applicants array
    applicant.status = status;
    await job.save();

    // CRITICAL FIX: Also update the status in user's appliedJobs array
    const user = await User.findById(applicant.userId);
    if (user) {
      const userApplication = user.appliedJobs.find(app => app.jobId.equals(jobId));
      if (userApplication) {
        userApplication.status = status;
        await user.save();
        console.log(`[updateApplicationStatus] Updated status in both Job and User collections for user ${user._id}`);
        
        // Send real-time notification to user
        notifyUser(user._id.toString(), 'application-status-updated', {
          jobId: job._id,
          jobTitle: job.title,
          companyName: job.companyName,
          status: status,
          message: `Your application for ${job.title} at ${job.companyName} has been ${status.toLowerCase()}`,
        });
      }
    }

    res.json({ msg: 'Status updated successfully', status });
  } catch (err) {
    console.error('Error updating application status:', err.message);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
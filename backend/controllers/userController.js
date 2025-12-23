// backend/controllers/userController.js

const User = require('../models/User');
const Job = require('../models/Job');
const { notifyAllAdmins } = require('../config/socket');

// === User Profile Management ===

exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id is available from the auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name, phone, gender, experience, skills, description } = req.body;
  const profileFields = {};
  if (name) profileFields.name = name;
  if (phone) profileFields.phone = phone;
  if (gender) profileFields.gender = gender;
  if (experience !== undefined) profileFields.experience = experience;
  if (description) profileFields.description = description;
  
  // Handle skills - accept both string and array formats
  if (skills) {
    if (Array.isArray(skills)) {
      profileFields.skills = skills;
    } else if (typeof skills === 'string') {
      profileFields.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
  }

  // Check for uploaded files
  if (req.files) {
    // New corrected code
    if (req.files.profilePhoto) {
      profileFields.profilePhoto = req.files.profilePhoto[0].path.replace(/\\/g, "/");
    }
    if (req.files.resume) {
      profileFields.resume = req.files.resume[0].path.replace(/\\/g, "/");
    }
  }

  try {
    let user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// === Job Application Management ===

exports.applyForJob = async (req, res) => {
  try {
    console.log(`[applyForJob] User ${req.user.id} applying for job ${req.params.id}`);
    
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user.id);

    // Check if job exists
    if (!job) {
      console.log('[applyForJob] Job not found');
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if user has already applied
    const alreadyApplied = user.appliedJobs.some(app => app.jobId.equals(job._id));
    if (alreadyApplied) {
      console.log('[applyForJob] User already applied');
      return res.status(400).json({ msg: 'You have already applied for this job' });
    }

    // Add application to both job and user
    job.applicants.push({ 
      userId: user._id, 
      appliedAt: new Date(),
      status: 'Pending'
    });
    user.appliedJobs.push({ 
      jobId: job._id, 
      appliedAt: new Date(),
      status: 'Pending'
    });

    console.log('[applyForJob] Saving job...');
    await job.save();
    console.log('[applyForJob] Saving user...');
    await user.save();
    console.log('[applyForJob] Application successful');

    // Notify all admins about new application
    notifyAllAdmins('new-application', {
      userId: user._id,
      userName: user.name,
      userEmail: user.email,
      jobId: job._id,
      jobTitle: job.title,
      companyName: job.companyName,
      message: `${user.name} applied for ${job.title} at ${job.companyName}`,
    });

    res.json({ msg: 'Application successful', status: 'Pending' });
  } catch (err) {
    console.error('[applyForJob] ERROR:', err);
    res.status(500).send('Server error');
  }
};

exports.withdrawApplication = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    // Remove application from job's applicants list
    await Job.findByIdAndUpdate(jobId, { 
      $pull: { applicants: { userId: userId } } 
    });

    // Remove job from user's appliedJobs list
    await User.findByIdAndUpdate(userId, { 
      $pull: { appliedJobs: { jobId: jobId } } 
    });

    res.json({ msg: 'Application withdrawn successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getAppliedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('appliedJobs.jobId');
    
    // Map to include status with job details
    const appliedJobs = user.appliedJobs.map(app => ({
      ...app.jobId.toObject(),
      applicationStatus: app.status,
      appliedAt: app.appliedAt
    }));
    
    res.json(appliedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// === Job Bookmark Management ===

exports.bookmarkJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const user = await User.findById(req.user.id);
    const job = await Job.findById(jobId);

    // Check if job exists
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check if already bookmarked
    if (user.bookmarkedJobs.includes(jobId)) {
      return res.status(400).json({ msg: 'Job already bookmarked' });
    }

    user.bookmarkedJobs.push(jobId);
    await user.save();

    res.json({ msg: 'Job bookmarked successfully', bookmarked: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.removeBookmark = async (req, res) => {
  try {
    const jobId = req.params.id;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, { 
      $pull: { bookmarkedJobs: jobId } 
    });

    res.json({ msg: 'Bookmark removed successfully', bookmarked: false });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getBookmarkedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookmarkedJobs');
    res.json(user.bookmarkedJobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
// backend/controllers/jobController.js

const Job = require('../models/Job');

// === Get all jobs with filtering ===
exports.getAllJobs = async (req, res) => {

  try {
    const { experience, salary } = req.query;
    let filter = {};

    // Check if the experience filter was actually used (it's not an empty string)
    if (experience != null && experience !== '') {
      const expNum = parseInt(experience, 10);
      
      // Case 1: Handle "3+ Years" (value is 3 or more)
      if (expNum >= 3) {
        filter.experienceRequired = { $gte: expNum };
      } 
      // Case 2: Handle exact matches for Fresher (0), 1, and 2 years
      else {
        filter.experienceRequired = expNum;
      }
    }
    
    if (salary) {
      filter.salary = { $gte: parseInt(salary, 10) };
    }
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// === Get a single job by ID ===
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'username');
    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
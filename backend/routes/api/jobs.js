// backend/routes/api/jobs.js

const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById } = require('../../controllers/jobController');
const { validateJobFilters, validateJobId } = require('../../middleware/validationMiddleware');

// @route   GET api/jobs
// @desc    Get all jobs (with filtering by experience and salary)
// @access  Public
router.get('/', validateJobFilters, getAllJobs);

// @route   GET api/jobs/:id
// @desc    Get a single job by its ID
// @access  Public
router.get('/:id', validateJobId, getJobById);

module.exports = router;
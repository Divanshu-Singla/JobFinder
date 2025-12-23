// backend/routes/api/admin.js

const express = require('express');
const router = express.Router();
const { authAdmin, isDefaultAdmin } = require('../../middleware/authMiddleware');
const {
  validateAddAdmin,
  validateAdminId,
  validateJobIdForApplicants,
  validateJob,
  validateJobId
} = require('../../middleware/validationMiddleware');
const {
  addAdmin,
  deleteAdmin,
  getAllAdmins,
  getAllUsers,
  deleteUser,
  getAllJobs,
  getJobApplicants,
  postJob,
  deleteJob,
  updateJob,
  updateApplicationStatus,
  getStats
} = require('../../controllers/adminController');

// --- Dashboard Stats ---

// @route   GET api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/stats', authAdmin, getStats);

// --- Admin Management Routes ---

// @route   GET api/admin/admins
// @desc    Get all admins
// @access  Private (Admin)
router.get('/admins', authAdmin, getAllAdmins);

// @route   POST api/admin/admins
// @desc    Add a new admin
// @access  Private (Default Admin Only)
router.post('/admins', authAdmin, isDefaultAdmin, validateAddAdmin, addAdmin);

// @route   DELETE api/admin/admins/:id
// @desc    Delete an admin
// @access  Private (Default Admin Only)
router.delete('/admins/:id', authAdmin, isDefaultAdmin, validateAdminId, deleteAdmin);

// --- User & Applicant Management ---

// @route   GET api/admin/users
// @desc    Get all registered users
// @access  Private (Admin)
router.get('/users', authAdmin, getAllUsers);

// @route   DELETE api/admin/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/users/:id', authAdmin, deleteUser);

// @route   GET api/admin/jobs/:jobId/applicants
// @desc    Get all applicants for a specific job
// @access  Private (Admin)
router.get('/jobs/:jobId/applicants', authAdmin, validateJobIdForApplicants, getJobApplicants);

// @route   PATCH api/admin/jobs/:jobId/applicants/:applicantId/status
// @desc    Update applicant status
// @access  Private (Admin)
router.patch('/jobs/:jobId/applicants/:applicantId/status', authAdmin, updateApplicationStatus);

// --- Job Management Routes ---

// @route   GET api/admin/jobs
// @desc    Get all jobs
// @access  Private (Admin)
router.get('/jobs', authAdmin, getAllJobs);

// @route   POST api/admin/jobs
// @desc    Post a new job
// @access  Private (Admin)
router.post('/jobs', authAdmin, validateJob, postJob);

// @route   DELETE api/admin/jobs/:id
// @desc    Delete a job
// @access  Private (Admin)
router.delete('/jobs/:id', authAdmin, validateJobId, deleteJob);

// @route   PUT api/admin/jobs/:id
// @desc    Update a job
// @access  Private (Admin)
router.put('/jobs/:id', authAdmin, validateJobId, validateJob, updateJob);

module.exports = router;
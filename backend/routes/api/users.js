// backend/routes/api/users.js

const express = require('express');
const router = express.Router();
const { authUser } = require('../../middleware/authMiddleware');
const { upload, validateUploadedFiles } = require('../../middleware/uploadMiddleware');
const { validateUserProfile, validateJobId } = require('../../middleware/validationMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  applyForJob,
  withdrawApplication,
  getAppliedJobs,
  bookmarkJob,
  removeBookmark,
  getBookmarkedJobs
} = require('../../controllers/userController');

// --- Profile Routes ---

// @route   GET api/users/profile
// @desc    Get the logged-in user's profile
// @access  Private (User)
router.get('/profile', authUser, getUserProfile);

// @route   PUT api/users/profile
// @desc    Update user profile (name, gender, etc., plus photo and resume)
// @access  Private (User)
router.put(
  '/profile',
  authUser,
  upload.fields([{ name: 'profilePhoto', maxCount: 1 }, { name: 'resume', maxCount: 1 }]),
  validateUploadedFiles,
  validateUserProfile,
  updateUserProfile
);

// --- Job Application Routes ---

// @route   POST api/users/jobs/:id/apply
// @desc    Apply for a job
// @access  Private (User)
router.post('/jobs/:id/apply', authUser, validateJobId, applyForJob);

// @route   DELETE api/users/jobs/:id/withdraw
// @desc    Withdraw a job application
// @access  Private (User)
router.delete('/jobs/:id/withdraw', authUser, validateJobId, withdrawApplication);

// @route   GET api/users/applied-jobs
// @desc    Get all jobs the user has applied for
// @access  Private (User)
router.get('/applied-jobs', authUser, getAppliedJobs);

// --- Job Bookmark Routes ---

// @route   POST api/users/jobs/:id/bookmark
// @desc    Bookmark a job
// @access  Private (User)
router.post('/jobs/:id/bookmark', authUser, validateJobId, bookmarkJob);

// @route   DELETE api/users/jobs/:id/bookmark
// @desc    Remove bookmark from a job
// @access  Private (User)
router.delete('/jobs/:id/bookmark', authUser, validateJobId, removeBookmark);

// @route   GET api/users/bookmarked-jobs
// @desc    Get all bookmarked jobs
// @access  Private (User)
router.get('/bookmarked-jobs', authUser, getBookmarkedJobs);

module.exports = router;
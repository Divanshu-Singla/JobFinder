// backend/routes/api/resume.js

const express = require('express');
const router = express.Router();
const User = require('../../models/User');

// @route   GET /api/resume/:userId
// @desc    Download user resume with proper headers
// @access  Public (or add auth middleware if needed)
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Get the Cloudinary URL
    let resumeUrl = user.resume;
    
    // For Cloudinary, just redirect with proper response type
    // Let Cloudinary handle the streaming directly
    res.redirect(resumeUrl);
    
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Error fetching resume', error: error.message });
  }
});

module.exports = router;

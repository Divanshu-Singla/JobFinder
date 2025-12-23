// backend/routes/api/resume.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
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
    
    // Fetch the file from Cloudinary
    const response = await axios.get(resumeUrl, {
      responseType: 'stream'
    });

    // Set proper headers for PDF download
    const filename = `${user.name.replace(/\s+/g, '_')}_Resume.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream the file to the response
    response.data.pipe(res);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

module.exports = router;

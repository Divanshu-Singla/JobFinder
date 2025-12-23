// backend/routes/api/files.js
// Route to serve files from MongoDB GridFS

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { getGridFSBucket } = require('../../config/gridfs');

// @route   GET /api/files/:fileId
// @desc    Get file from GridFS by ID
// @access  Public
router.get('/:fileId', async (req, res) => {
  try {
    const bucket = getGridFSBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    // Find file in GridFS
    const files = await bucket.find({ _id: fileId }).toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = files[0];

    // Set response headers for inline viewing
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', 'inline'); // Force inline viewing in browser
    
    // Stream file from GridFS
    const downloadStream = bucket.openDownloadStream(fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ message: 'Error streaming file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).json({ message: 'Error fetching file', error: error.message });
  }
});

module.exports = router;

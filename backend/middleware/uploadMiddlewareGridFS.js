// backend/middleware/uploadMiddlewareGridFS.js
// File upload middleware using MongoDB GridFS

const multer = require('multer');
const path = require('path');
const { getGridFSBucket } = require('../config/gridfs');
const logger = require('../config/logger');
const constants = require('../config/constants');

/**
 * Multer memory storage - files stored in memory temporarily
 */
const storage = multer.memoryStorage();

/**
 * File filter with strict validation
 */
const fileFilter = (req, file, cb) => {
  const isResume = file.fieldname === 'resume';
  const isProfilePhoto = file.fieldname === 'profilePhoto';

  // Validate field name
  if (!isResume && !isProfilePhoto) {
    logger.warn(`Invalid file field: ${file.fieldname}`);
    return cb(new Error('Invalid file field name'), false);
  }

  // Check file size based on type
  const maxSize = isResume ? constants.MAX_RESUME_SIZE : constants.MAX_PROFILE_PHOTO_SIZE;
  
  // Validate mime type
  const allowedTypes = isResume 
    ? constants.ALLOWED_RESUME_TYPES 
    : constants.ALLOWED_IMAGE_TYPES;

  if (!allowedTypes.includes(file.mimetype)) {
    const expectedTypes = isResume ? 'PDF, DOC, DOCX' : 'JPG, PNG';
    logger.warn(`Invalid file type: ${file.mimetype} for ${file.fieldname}`);
    return cb(new Error(`Only ${expectedTypes} files are allowed for ${file.fieldname}`), false);
  }

  // Validate file extension
  const ext = path.extname(file.originalname).toLowerCase();
  const validExtensions = isResume 
    ? ['.pdf', '.doc', '.docx'] 
    : ['.jpg', '.jpeg', '.png'];

  if (!validExtensions.includes(ext)) {
    logger.warn(`Invalid file extension: ${ext} for ${file.fieldname}`);
    return cb(new Error(`Invalid file extension: ${ext}`), false);
  }

  cb(null, true);
};

/**
 * Initialize multer with memory storage
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: constants.MAX_FILE_SIZE,
    files: 2, // Max 2 files per request (profile photo + resume)
  },
  fileFilter: fileFilter
});

/**
 * Upload file to GridFS
 * Returns a promise that resolves with file ID and URL
 */
const uploadToGridFS = (file, fieldname) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();
      const filename = `${fieldname}-${Date.now()}${path.extname(file.originalname)}`;
      
      // Create upload stream
      const uploadStream = bucket.openUploadStream(filename, {
        contentType: file.mimetype,
        metadata: {
          originalName: file.originalname,
          fieldname: fieldname,
          uploadedAt: new Date()
        }
      });

      // Handle upload completion
      uploadStream.on('finish', () => {
        logger.info(`File uploaded to GridFS: ${filename}`);
        resolve({
          fileId: uploadStream.id,
          filename: filename,
          url: `/api/files/${uploadStream.id}`
        });
      });

      // Handle errors
      uploadStream.on('error', (error) => {
        logger.error('GridFS upload error:', error);
        reject(error);
      });

      // Write buffer to stream
      uploadStream.end(file.buffer);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  upload,
  uploadToGridFS
};

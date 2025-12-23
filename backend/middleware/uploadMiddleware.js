// backend/middleware/uploadMiddleware.js
// Secure file upload middleware with validation and signature checking

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const logger = require('../config/logger');
const constants = require('../config/constants');

/**
 * Read file signature (magic numbers) to verify actual file type
 */
const verifyFileSignature = (filePath, expectedType) => {
  const signatures = constants.FILE_SIGNATURES[expectedType];
  if (!signatures) return true; // No signature check for this type

  try {
    const buffer = Buffer.alloc(signatures.length);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buffer, 0, signatures.length, 0);
    fs.closeSync(fd);

    // Compare file signature
    for (let i = 0; i < signatures.length; i++) {
      if (buffer[i] !== signatures[i]) {
        return false;
      }
    }
    return true;
  } catch (error) {
    logger.error('File signature verification failed:', error);
    return false;
  }
};

/**
 * Storage configuration with separate folders for different file types
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'resume') {
      uploadPath = 'uploads/resumes/';
    } else if (file.fieldname === 'profilePhoto') {
      uploadPath = 'uploads/profiles/';
    }

    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Create secure unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    cb(null, `${file.fieldname}-${uniqueSuffix}-${sanitizedName}`);
  }
});

/**
 * Enhanced file filter with strict validation
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
 * Initialize multer with enhanced security
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
 * Post-upload validation middleware
 * Verifies file signatures after upload
 */
const validateUploadedFiles = (req, res, next) => {
  if (!req.files) {
    return next();
  }

  try {
    const filesToCheck = [];
    
    // Collect all uploaded files
    if (req.files.profilePhoto) {
      filesToCheck.push(...req.files.profilePhoto.map(f => ({ ...f, type: 'image' })));
    }
    if (req.files.resume) {
      filesToCheck.push(...req.files.resume.map(f => ({ ...f, type: 'document' })));
    }

    // Verify each file's signature
    for (const file of filesToCheck) {
      const isValid = verifyFileSignature(file.path, file.mimetype);
      
      if (!isValid) {
        // Delete the suspicious file
        fs.unlinkSync(file.path);
        logger.warn(`File signature mismatch detected: ${file.originalname}`);
        return res.status(400).json({ 
          msg: 'File validation failed. File type does not match its content.' 
        });
      }
    }

    next();
  } catch (error) {
    logger.error('File validation error:', error);
    return res.status(500).json({ msg: 'File validation error' });
  }
};

module.exports = {
  upload,
  validateUploadedFiles
};
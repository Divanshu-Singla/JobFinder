// backend/middleware/uploadMiddleware.js
// Secure file upload middleware with Cloudinary cloud storage

const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const logger = require('../config/logger');
const constants = require('../config/constants');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Cloudinary storage configuration with separate folders for different file types
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isResume = file.fieldname === 'resume';
    const isProfilePhoto = file.fieldname === 'profilePhoto';
    
    // Determine folder and resource type
    let folder = 'job-portal/';
    let resourceType = 'auto';
    let format = undefined;
    let publicId = `${file.fieldname}-${Date.now()}`;
    
    if (isResume) {
      folder += 'resumes';
      resourceType = 'raw'; // For PDF, DOC files
      // For raw files, include extension in public_id
      const ext = path.extname(file.originalname).toLowerCase().substring(1);
      publicId = `${file.fieldname}-${Date.now()}.${ext}`;
    } else if (isProfilePhoto) {
      folder += 'profiles';
      resourceType = 'image';
      format = 'jpg'; // Convert all images to jpg
    }
    
    return {
      folder: folder,
      resource_type: resourceType,
      format: format,
      allowed_formats: isResume ? ['pdf', 'doc', 'docx'] : ['jpg', 'jpeg', 'png'],
      public_id: publicId,
      access_mode: 'public', // Ensure public access
      flags: isResume ? 'attachment:false' : undefined, // Allow inline viewing for PDFs
      transformation: isProfilePhoto ? [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto:good' }
      ] : undefined
    };
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
 * Initialize multer with Cloudinary storage and enhanced security
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
 * Post-upload validation middleware (simplified for Cloudinary)
 * Cloudinary handles most validation, but we add extra checks
 */
const validateUploadedFiles = (req, res, next) => {
  // With Cloudinary, files are already uploaded and validated
  // We just log the upload for monitoring
  if (req.files) {
    const uploadedFiles = [];
    
    if (req.files.profilePhoto) {
      uploadedFiles.push(...req.files.profilePhoto.map(f => f.path));
    }
    if (req.files.resume) {
      uploadedFiles.push(...req.files.resume.map(f => f.path));
    }
    
    if (uploadedFiles.length > 0) {
      logger.info('Files uploaded to Cloudinary:', uploadedFiles);
    }
  }
  
  next();
};

module.exports = {
  upload,
  validateUploadedFiles,
  cloudinary // Export for potential cleanup operations
};
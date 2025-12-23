// backend/config/gridfs.js
// GridFS configuration for storing files in MongoDB

const mongoose = require('mongoose');

let bucket;

// Initialize GridFS bucket once MongoDB is connected
const initGridFS = () => {
  try {
    const db = mongoose.connection.db;
    if (!db) {
      console.error('MongoDB connection not ready for GridFS initialization');
      return null;
    }
    
    // Use GridFSBucket from mongoose's mongodb driver
    const { GridFSBucket } = mongoose.mongo;
    
    bucket = new GridFSBucket(db, {
      bucketName: 'uploads' // Collection name will be uploads.files and uploads.chunks
    });
    console.log('GridFS bucket initialized successfully');
    return bucket;
  } catch (error) {
    console.error('Error initializing GridFS:', error);
    return null;
  }
};

const getGridFSBucket = () => {
  if (!bucket) {
    console.log('GridFS bucket not initialized, attempting to initialize...');
    return initGridFS();
  }
  return bucket;
};

module.exports = { initGridFS, getGridFSBucket };

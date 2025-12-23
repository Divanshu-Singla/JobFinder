// backend/config/gridfs.js
// GridFS configuration for storing files in MongoDB

const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');

let bucket;

// Initialize GridFS bucket once MongoDB is connected
const initGridFS = () => {
  const db = mongoose.connection.db;
  bucket = new GridFSBucket(db, {
    bucketName: 'uploads' // Collection name will be uploads.files and uploads.chunks
  });
  console.log('GridFS bucket initialized');
  return bucket;
};

const getGridFSBucket = () => {
  if (!bucket) {
    return initGridFS();
  }
  return bucket;
};

module.exports = { initGridFS, getGridFSBucket };

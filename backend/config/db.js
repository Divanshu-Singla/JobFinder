const mongoose = require('mongoose');
const logger = require('./logger');
const constants = require('./constants');
require('dotenv').config();

/**
 * Connect to MongoDB with retry logic and proper error handling
 */
const connectDB = async () => {
  let retries = constants.DB_RETRY_ATTEMPTS;
  let delay = constants.DB_RETRY_DELAY_MS;

  while (retries > 0) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: constants.DB_CONNECTION_TIMEOUT_MS,
      });

      logger.info(`MongoDB Connected: ${conn.connection.host}`);
      
      // Handle connection events
      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected. Attempting to reconnect...');
      });

      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      return conn;
    } catch (err) {
      retries -= 1;
      logger.error(`MongoDB connection failed. Retries left: ${retries}`, {
        error: err.message,
        nextRetryIn: retries > 0 ? `${delay / 1000}s` : 'none'
      });

      if (retries === 0) {
        logger.error('MongoDB connection failed after all retry attempts');
        process.exit(1);
      }

      // Exponential backoff: wait before next retry
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Double the delay for next attempt
    }
  }
};

module.exports = connectDB;
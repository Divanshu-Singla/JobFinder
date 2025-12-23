// backend/config/logger.js
// Winston logger configuration for application-wide logging

const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define log format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format (colorized for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define which transports to use based on environment
const transports = [
  // Console transport (always enabled)
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/error.log'),
    level: 'error',
    format: format,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),

  // Combined log file
  new winston.transports.File({
    filename: path.join(__dirname, '../logs/combined.log'),
    format: format,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

module.exports = logger;

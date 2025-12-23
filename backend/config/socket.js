// backend/config/socket.js

const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

let io;

// Initialize Socket.io server
const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true,
    },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Attach user/admin info to socket
      if (decoded.user) {
        socket.userId = decoded.user.id;
        socket.userType = 'user';
      } else if (decoded.admin) {
        socket.adminId = decoded.admin.id;
        socket.userType = 'admin';
        socket.isDefaultAdmin = decoded.admin.isDefault;
      } else {
        return next(new Error('Authentication error: Invalid token'));
      }
      
      next();
    } catch (err) {
      logger.error('Socket authentication error:', err);
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id} (${socket.userType})`);

    // Join user to their personal room
    if (socket.userType === 'user') {
      socket.join(`user:${socket.userId}`);
      logger.info(`User ${socket.userId} joined room: user:${socket.userId}`);
    } else if (socket.userType === 'admin') {
      socket.join('admin-room');
      logger.info(`Admin ${socket.adminId} joined room: admin-room`);
    }

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id} (${socket.userType})`);
    });

    // Handle errors
    socket.on('error', (error) => {
      logger.error('Socket error:', error);
    });
  });

  logger.info('Socket.io server initialized');
  return io;
};

// Get the Socket.io instance
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized! Call initializeSocket first.');
  }
  return io;
};

// Notification emitter functions
const notifyUser = (userId, event, data) => {
  try {
    const io = getIO();
    io.to(`user:${userId}`).emit(event, data);
    logger.info(`Notification sent to user ${userId}: ${event}`);
  } catch (error) {
    logger.error('Error sending user notification:', error);
  }
};

const notifyAllAdmins = (event, data) => {
  try {
    const io = getIO();
    io.to('admin-room').emit(event, data);
    logger.info(`Notification sent to all admins: ${event}`);
  } catch (error) {
    logger.error('Error sending admin notification:', error);
  }
};

const notifyAllUsers = (event, data) => {
  try {
    const io = getIO();
    // Broadcast to all connected users
    io.sockets.sockets.forEach((socket) => {
      if (socket.userType === 'user') {
        socket.emit(event, data);
      }
    });
    logger.info(`Notification sent to all users: ${event}`);
  } catch (error) {
    logger.error('Error sending broadcast notification:', error);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  notifyUser,
  notifyAllAdmins,
  notifyAllUsers,
};

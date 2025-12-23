// src/context/SocketContext.js

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, admin } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Determine which token to use
    let token = null;
    if (user) {
      token = localStorage.getItem('userToken');
    } else if (admin) {
      token = localStorage.getItem('adminToken');
    }

    // Only connect if we have a token
    if (token) {
      const SOCKET_URL = process.env.REACT_APP_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
      
      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setConnected(false);
      });

      setSocket(newSocket);

      return () => {
        console.log('Closing socket connection');
        newSocket.close();
      };
    } else {
      // Clean up socket if no token
      if (socket) {
        socket.close();
        setSocket(null);
        setConnected(false);
      }
    }
  }, [user, admin, socket]);

  // Add notification to state
  const addNotification = useCallback((notification) => {
    setNotifications(prev => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        read: false,
        ...notification
      }
    ]);
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Clear specific notification
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  const value = {
    socket,
    connected,
    notifications,
    addNotification,
    markAsRead,
    clearNotifications,
    removeNotification,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

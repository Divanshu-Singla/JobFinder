// src/components/NotificationSnackbar.js

import React, { useState, useEffect } from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useSocket } from '../context/SocketContext';

const NotificationSnackbar = () => {
  const { notifications, removeNotification } = useSocket();
  const [currentNotification, setCurrentNotification] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Show newest unread notification
    const unreadNotifications = notifications.filter(n => !n.read);
    if (unreadNotifications.length > 0 && !currentNotification) {
      const latest = unreadNotifications[unreadNotifications.length - 1];
      setCurrentNotification(latest);
      setOpen(true);
    }
  }, [notifications, currentNotification]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
    setTimeout(() => {
      if (currentNotification) {
        removeNotification(currentNotification.id);
        setCurrentNotification(null);
      }
    }, 300);
  };

  if (!currentNotification) return null;

  // Determine severity based on notification type
  const getSeverity = (notification) => {
    if (notification.status === 'Accepted') return 'success';
    if (notification.status === 'Rejected') return 'error';
    return 'info';
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={handleClose}
        severity={getSeverity(currentNotification)}
        variant="filled"
        sx={{ width: '100%', minWidth: 300 }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {currentNotification.message}
      </Alert>
    </Snackbar>
  );
};

export default NotificationSnackbar;

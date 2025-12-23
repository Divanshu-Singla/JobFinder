// src/pages/ContactPage.js

import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
} from '@mui/material';
import API from '../api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (formData.subject.trim().length < 3) {
      newErrors.subject = 'Subject must be at least 3 characters';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await API.post('/contact', formData);

      setAlert({
        show: true,
        type: 'success',
        message: response.data.message || 'Thank you for contacting us! We will get back to you soon.',
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to send message. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            p: 0.5,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 3.5,
              bgcolor: 'white',
            }}
          >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              mb: 4,
              color: '#1a1a1a',
            }}
          >
            Contact Us
          </Typography>

          {alert.show && (
            <Alert
              severity={alert.type}
              onClose={() => setAlert({ ...alert, show: false })}
              sx={{ mb: 3 }}
            >
              {alert.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              disabled={loading}
              required
              variant="standard"
              sx={{
                mb: 3,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#667eea',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#667eea',
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              required
              variant="standard"
              sx={{
                mb: 3,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#667eea',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#667eea',
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              error={!!errors.subject}
              helperText={errors.subject}
              disabled={loading}
              required
              variant="standard"
              sx={{
                mb: 3,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#667eea',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#667eea',
                },
              }}
            />

            <TextField
              fullWidth
              placeholder="Message"
              name="message"
              multiline
              rows={4}
              value={formData.message}
              onChange={handleChange}
              error={!!errors.message}
              helperText={errors.message}
              disabled={loading}
              required
              variant="standard"
              sx={{
                mb: 4,
                '& .MuiInput-underline:before': {
                  borderBottomColor: '#ccc',
                },
                '& .MuiInput-underline:hover:before': {
                  borderBottomColor: '#667eea',
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: '#667eea',
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(90deg, #5568d3 0%, #6a3f8f 100%)',
                },
                '&:disabled': {
                  background: '#ccc',
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Send'}
            </Button>
          </form>
        </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default ContactPage;

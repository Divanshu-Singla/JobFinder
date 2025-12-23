// src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupsIcon from '@mui/icons-material/Groups';
import { validateEmail, validatePassword, getErrorMessage } from '../utils/errorHandler';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'email') {
      const validation = validateEmail(value);
      error = validation.valid ? '' : validation.message;
    } else if (name === 'password') {
      const validation = validatePassword(value);
      error = validation.valid ? '' : validation.message;
    }
    
    setValidationErrors(prev => ({ ...prev, [name]: error }));
  };

  const isFormValid = () => {
    const emailValid = validateEmail(formData.email).valid;
    const passwordValid = validatePassword(formData.password).valid;
    return emailValid && passwordValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate all fields on submit
    const emailValidation = validateEmail(formData.email);
    const passwordValidation = validatePassword(formData.password);
    
    if (!emailValidation.valid || !passwordValidation.valid) {
      setValidationErrors({
        email: emailValidation.message,
        password: passwordValidation.message
      });
      setTouched({ email: true, password: true });
      return;
    }
    
    try {
      await loginUser(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      const errorInfo = getErrorMessage(err);
      setError(errorInfo.message);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Left Side - Form */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: { xs: 3, md: 6 },
          bgcolor: 'white'
        }}
      >
        <Box sx={{ maxWidth: 460, width: '100%' }}>
          {/* Header with better hierarchy */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: '-0.02em'
              }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="#64748b" sx={{ fontSize: '1.05rem', fontWeight: 400 }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Email Address *
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              autoFocus
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && !!validationErrors.email}
              helperText={touched.email && validationErrors.email}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    '& fieldset': {
                      borderColor: '#cbd5e1'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.95rem',
                  py: 0.5
                }
              }}
            />
            
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Password *
            </Typography>
            <TextField
              required
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && !!validationErrors.password}
              helperText={touched.password && validationErrors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: '#f8fafc',
                  transition: 'all 0.2s ease',
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                    borderWidth: '1.5px'
                  },
                  '&:hover': {
                    bgcolor: '#f1f5f9',
                    '& fieldset': {
                      borderColor: '#cbd5e1'
                    }
                  },
                  '&.Mui-focused': {
                    bgcolor: 'white',
                    boxShadow: '0 0 0 3px rgba(102,126,234,0.1)',
                    '& fieldset': {
                      borderColor: '#667eea',
                      borderWidth: '2px'
                    }
                  }
                },
                '& input': {
                  fontSize: '0.95rem',
                  py: 0.5
                }
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={!isFormValid()}
              sx={{
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                  boxShadow: '0 6px 20px rgba(102,126,234,0.5)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 2px 8px rgba(102,126,234,0.3)'
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  boxShadow: 'none'
                }
              }}
            >
              Sign In
            </Button>
            
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e2e8f0' }}>
              <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.95rem' }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  sx={{ 
                    color: '#667eea',
                    fontWeight: 600, 
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#5568d3',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Create Account
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Side - Hero Section */}
      <Box
        sx={{
          width: '50%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Dot pattern */}
        <Box sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.6
        }} />
        
        {/* Soft glow effects */}
        <Box sx={{ 
          position: 'absolute', 
          top: '-10%', 
          right: '-5%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: '-10%', 
          left: '-5%', 
          width: '350px', 
          height: '350px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(70px)'
        }} />
        
        <Box sx={{ textAlign: 'center', maxWidth: 550, zIndex: 1 }}>
          {/* Handshake emoji for connection/partnership */}
          <Box sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.18)',
            mb: 4,
            border: '3px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            fontSize: '3.5rem'
          }}>
            🤝
          </Box>
          
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: '2.75rem', mb: 2, lineHeight: 1.2 }}>
            Start Your Career
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.95, lineHeight: 1.8, fontSize: '1.125rem', fontWeight: 400 }}>
            Connect with leading employers and discover opportunities matched to your skills
          </Typography>
          
          {/* Stats with unique icons */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 4, 
            mt: 6,
            pt: 5,
            borderTop: '1px solid rgba(255,255,255,0.2)'
          }}>
            <Box>
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.15)',
                mb: 2
              }}>
                <TrendingUpIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" fontWeight="700" sx={{ fontSize: '2.5rem', mb: 1 }}>1000+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem', letterSpacing: '0.5px' }}>Active Jobs</Typography>
            </Box>
            <Box>
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.15)',
                mb: 2
              }}>
                <BusinessCenterIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" fontWeight="700" sx={{ fontSize: '2.5rem', mb: 1 }}>500+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem', letterSpacing: '0.5px' }}>Companies</Typography>
            </Box>
            <Box>
              <Box sx={{ 
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 50,
                height: 50,
                borderRadius: '12px',
                bgcolor: 'rgba(255,255,255,0.15)',
                mb: 2
              }}>
                <GroupsIcon sx={{ fontSize: 28, color: 'white' }} />
              </Box>
              <Typography variant="h3" fontWeight="700" sx={{ fontSize: '2.5rem', mb: 1 }}>10k+</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.9rem', letterSpacing: '0.5px' }}>Job Seekers</Typography>
            </Box>
          </Box>
        </Box>
        
        {/* CSS Animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(45deg); }
              50% { transform: translateY(-20px) rotate(45deg); }
            }
          `}
        </style>
      </Box>
    </Box>
  );
};

export default LoginPage;
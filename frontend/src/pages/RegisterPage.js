// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  InputAdornment,
  IconButton,
  Link,
  LinearProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import StarIcon from '@mui/icons-material/Star';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  getErrorMessage,
  getPasswordStrengthColor 
} from '../utils/errorHandler';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({ 
    name: false, 
    email: false, 
    password: false, 
    confirmPassword: false,
    gender: false 
  });
  const [validationErrors, setValidationErrors] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '',
    gender: '' 
  });
  const [passwordStrength, setPasswordStrength] = useState('none');
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field);
  };

  const validateField = (field) => {
    let error = '';
    
    switch(field) {
      case 'name':
        const nameValidation = validateName(name);
        error = nameValidation.valid ? '' : nameValidation.message;
        break;
      case 'email':
        const emailValidation = validateEmail(email);
        error = emailValidation.valid ? '' : emailValidation.message;
        break;
      case 'password':
        const passwordValidation = validatePassword(password);
        error = passwordValidation.valid ? '' : passwordValidation.message;
        setPasswordStrength(passwordValidation.strength);
        break;
      case 'confirmPassword':
        if (!confirmPassword) {
          error = 'Please confirm your password';
        } else if (confirmPassword !== password) {
          error = 'Passwords do not match';
        }
        break;
      case 'gender':
        if (!gender) {
          error = 'Please select your gender';
        }
        break;
      default:
        break;
    }
    
    setValidationErrors(prev => ({ ...prev, [field]: error }));
  };

  const isFormValid = () => {
    return validateName(name).valid &&
           validateEmail(email).valid &&
           validatePassword(password).valid &&
           confirmPassword === password &&
           password.length >= 8 &&
           gender !== '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Mark all fields as touched
    setTouched({ name: true, email: true, password: true, confirmPassword: true, gender: true });
    
    // Validate all fields
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
    
    const errors = {
      name: nameValidation.valid ? '' : nameValidation.message,
      email: emailValidation.valid ? '' : emailValidation.message,
      password: passwordValidation.valid ? '' : passwordValidation.message,
      confirmPassword: confirmPassword !== password ? 'Passwords do not match' : '',
      gender: !gender ? 'Please select your gender' : ''
    };
    
    setValidationErrors(errors);
    
    if (Object.values(errors).some(err => err !== '')) {
      return;
    }
    
    setLoading(true);
    try {
      await registerUser(name, email, password, gender);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error response:', err.response?.data);
      const errorInfo = getErrorMessage(err);
      setError(errorInfo.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {/* Left Side - Hero Section */}
      <Box
        sx={{
          width: '50%',
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
          top: '10%', 
          left: '-5%', 
          width: '300px', 
          height: '300px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(60px)'
        }} />
        <Box sx={{ 
          position: 'absolute', 
          bottom: '-10%', 
          right: '-5%', 
          width: '350px', 
          height: '350px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.08)',
          filter: 'blur(70px)'
        }} />
        
        <Box sx={{ textAlign: 'center', maxWidth: 550, zIndex: 1 }}>
          {/* Sparkles emoji for new beginnings */}
          <Box sx={{ 
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 110,
            height: 110,
            borderRadius: '50%',
            bgcolor: 'rgba(255,255,255,0.18)',
            mb: 4,
            border: '3px solid rgba(255,255,255,0.25)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            fontSize: '3.5rem'
          }}>
            ✨
          </Box>
          
          <Typography variant="h3" fontWeight="700" gutterBottom sx={{ fontSize: '2.75rem', mb: 2, lineHeight: 1.2 }}>
            Create Account
          </Typography>
          <Typography variant="h6" sx={{ mb: 6, opacity: 0.95, lineHeight: 1.8, fontSize: '1.125rem', fontWeight: 400 }}>
            Join professionals finding great opportunities
          </Typography>
          
          {/* Feature list with unique icons */}
          <Box sx={{ mt: 7, textAlign: 'left', maxWidth: 480, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3.5 }}>
              <Box sx={{ 
                minWidth: 52, 
                height: 52, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <StarIcon sx={{ fontSize: 26, color: '#FFD700' }} />
              </Box>
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body1" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
                  Quality Job Listings
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', opacity: 0.85 }}>
                  Access opportunities from top companies
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3.5 }}>
              <Box sx={{ 
                minWidth: 52, 
                height: 52, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <ConnectWithoutContactIcon sx={{ fontSize: 26, color: 'white' }} />
              </Box>
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body1" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
                  Direct Connection
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', opacity: 0.85 }}>
                  Connect directly with hiring teams
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5, mb: 3.5 }}>
              <Box sx={{ 
                minWidth: 52, 
                height: 52, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <AccountCircleIcon sx={{ fontSize: 26, color: 'white' }} />
              </Box>
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body1" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
                  Professional Profile
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', opacity: 0.85 }}>
                  Showcase your skills and experience
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2.5 }}>
              <Box sx={{ 
                minWidth: 52, 
                height: 52, 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.15))',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <TrackChangesIcon sx={{ fontSize: 26, color: 'white' }} />
              </Box>
              <Box sx={{ pt: 0.5 }}>
                <Typography variant="body1" sx={{ fontSize: '1.125rem', fontWeight: 600, mb: 0.5 }}>
                  Application Tracking
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', opacity: 0.85 }}>
                  Monitor your job application status
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        
        {/* CSS Animations */}
        <style>
          {`
            @keyframes morphing {
              0%, 100% {
                border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
              }
              50% {
                border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%;
              }
            }
          `}
        </style>
      </Box>

      {/* Right Side - Form */}
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
          <Box sx={{ mb: 5, textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              fontWeight="700" 
              gutterBottom 
              sx={{ 
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1.5,
                letterSpacing: '-0.02em'
              }}
            >
              Create Account
            </Typography>
            <Typography variant="body1" color="#64748b" sx={{ fontSize: '1.05rem', fontWeight: 400 }}>
              Start your journey to finding the perfect job
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Full Name *
            </Typography>
            <TextField
              required
              fullWidth
              id="fullName"
              name="fullName"
              autoComplete="name"
              autoFocus
              placeholder="John Doe"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (touched.name) validateField('name');
              }}
              onBlur={() => handleBlur('name')}
              error={touched.name && !!validationErrors.name}
              helperText={touched.name && validationErrors.name}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#d0d7de' },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: '2px' }
                }
              }}
            />
            
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Email Address *
            </Typography>
            <TextField
              required
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (touched.email) validateField('email');
              }}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!validationErrors.email}
              helperText={touched.email && validationErrors.email}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#d0d7de' },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: '2px' }
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
              autoComplete="new-password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) validateField('password');
              }}
              onBlur={() => handleBlur('password')}
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
                mb: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#d0d7de' },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: '2px' }
                }
              }}
            />
            {password && passwordStrength !== 'none' && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password Strength:
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: getPasswordStrengthColor(passwordStrength),
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  >
                    {passwordStrength}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={
                    passwordStrength === 'weak' ? 33 : 
                    passwordStrength === 'medium' ? 66 : 100
                  }
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: getPasswordStrengthColor(passwordStrength),
                      borderRadius: 3
                    }
                  }}
                />
              </Box>
            )}
            
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Confirm Password *
            </Typography>
            <TextField
              required
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (touched.confirmPassword) validateField('confirmPassword');
              }}
              onBlur={() => handleBlur('confirmPassword')}
              error={touched.confirmPassword && !!validationErrors.confirmPassword}
              helperText={touched.confirmPassword && validationErrors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#d0d7de' },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: '2px' }
                }
              }}
            />
            
            <Typography variant="body2" fontWeight="600" sx={{ mb: 1, color: '#24292f' }}>
              Gender *
            </Typography>
            <TextField
              select
              fullWidth
              id="gender"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
                if (touched.gender) validateField('gender');
              }}
              onBlur={() => handleBlur('gender')}
              error={touched.gender && !!validationErrors.gender}
              helperText={touched.gender && validationErrors.gender}
              SelectProps={{
                native: true,
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1.5,
                  bgcolor: 'white',
                  '& fieldset': { borderColor: '#d0d7de' },
                  '&:hover fieldset': { borderColor: '#667eea' },
                  '&.Mui-focused fieldset': { borderColor: '#667eea', borderWidth: '2px' }
                }
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </TextField>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading || !isFormValid()}
              sx={{
                py: 1.75,
                fontSize: '1rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                mb: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                boxShadow: '0 4px 14px rgba(240,147,251,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #e77fea 0%, #e4405f 100%)',
                  boxShadow: '0 6px 20px rgba(240,147,251,0.5)',
                  transform: 'translateY(-2px)'
                },
                '&:active': {
                  transform: 'translateY(0px)',
                  boxShadow: '0 2px 8px rgba(240,147,251,0.3)'
                },
                '&:disabled': {
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  boxShadow: 'none'
                }
              }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', pt: 2, borderTop: '1px solid #e2e8f0' }}>
              <Typography variant="body2" color="#64748b" sx={{ fontSize: '0.95rem' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/login"
                  sx={{ 
                    color: '#f093fb',
                    fontWeight: 600, 
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      color: '#e77fea',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RegisterPage;
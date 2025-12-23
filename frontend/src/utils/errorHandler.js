// src/utils/errorHandler.js

/**
 * Centralized error handler for consistent error messages
 */

export const getErrorMessage = (error) => {
  // Network errors
  if (!error.response) {
    return {
      type: 'network',
      message: 'Network error. Please check your internet connection.',
      severity: 'error'
    };
  }

  // Server errors (500+)
  if (error.response.status >= 500) {
    return {
      type: 'server',
      message: 'Server error. Please try again later.',
      severity: 'error'
    };
  }

  // Client errors (400+)
  if (error.response.status >= 400) {
    const message = error.response.data?.msg || 
                   error.response.data?.message || 
                   'Something went wrong. Please try again.';
    return {
      type: 'client',
      message,
      severity: 'error'
    };
  }

  return {
    type: 'unknown',
    message: 'An unexpected error occurred.',
    severity: 'error'
  };
};

/**
 * Email validation
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, message: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Password validation
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, message: 'Password is required', strength: 'none' };
  }
  
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters', strength: 'weak' };
  }
  
  // Check required pattern
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  
  if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecial) {
    return { 
      valid: false, 
      message: 'Password must contain uppercase, lowercase, number & special character (@$!%*?&)',
      strength: 'weak' 
    };
  }
  
  // Check password strength
  let strength = 'weak';
  let strengthScore = 0;
  
  if (password.length >= 8) strengthScore++;
  if (hasLowercase) strengthScore++;
  if (hasUppercase) strengthScore++;
  if (hasNumber) strengthScore++;
  if (hasSpecial) strengthScore++;
  
  if (strengthScore <= 2) {
    strength = 'weak';
  } else if (strengthScore <= 3) {
    strength = 'medium';
  } else {
    strength = 'strong';
  }
  
  return { valid: true, message: '', strength };
};

/**
 * Name validation
 */
export const validateName = (name) => {
  if (!name) {
    return { valid: false, message: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters' };
  }
  
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    return { valid: false, message: 'Name should only contain letters' };
  }
  
  return { valid: true, message: '' };
};

/**
 * Get password strength color
 */
export const getPasswordStrengthColor = (strength) => {
  switch (strength) {
    case 'weak': return '#f44336'; // red
    case 'medium': return '#ff9800'; // orange
    case 'strong': return '#4caf50'; // green
    default: return '#9e9e9e'; // grey
  }
};

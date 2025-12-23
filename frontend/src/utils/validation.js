// src/utils/validation.js
// Frontend input validation utilities

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password || password.trim() === '') {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  if (!/[@$!%*#?&]/.test(password)) {
    return 'Password must contain at least one special character (@$!%*#?&)';
  }
  
  return null;
};

/**
 * Validate name field
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required';
  }
  
  if (name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  
  if (name.trim().length > 50) {
    return 'Name must not exceed 50 characters';
  }
  
  return null;
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return null; // Phone is optional
  }
  
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    return 'Please enter a valid phone number (10-15 digits)';
  }
  
  return null;
};

/**
 * Validate job title
 * @param {string} title - Job title to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateJobTitle = (title) => {
  if (!title || title.trim() === '') {
    return 'Job title is required';
  }
  
  if (title.trim().length < 3) {
    return 'Job title must be at least 3 characters long';
  }
  
  if (title.trim().length > 100) {
    return 'Job title must not exceed 100 characters';
  }
  
  return null;
};

/**
 * Validate salary
 * @param {number|string} salary - Salary to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateSalary = (salary) => {
  if (!salary || salary === '') {
    return 'Salary is required';
  }
  
  const salaryNum = parseFloat(salary);
  
  if (isNaN(salaryNum)) {
    return 'Salary must be a valid number';
  }
  
  if (salaryNum < 0) {
    return 'Salary cannot be negative';
  }
  
  if (salaryNum > 100000000) {
    return 'Salary value is too high';
  }
  
  return null;
};

/**
 * Validate experience years
 * @param {number|string} experience - Years of experience to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateExperience = (experience) => {
  if (experience === '' || experience === null || experience === undefined) {
    return 'Experience is required';
  }
  
  const expNum = parseInt(experience, 10);
  
  if (isNaN(expNum)) {
    return 'Experience must be a valid number';
  }
  
  if (expNum < 0) {
    return 'Experience cannot be negative';
  }
  
  if (expNum > 50) {
    return 'Experience years seems too high';
  }
  
  return null;
};

/**
 * Validate location
 * @param {string} location - Location to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateLocation = (location) => {
  if (!location || location.trim() === '') {
    return 'Location is required';
  }
  
  if (location.trim().length < 2) {
    return 'Location must be at least 2 characters long';
  }
  
  if (location.trim().length > 100) {
    return 'Location must not exceed 100 characters';
  }
  
  return null;
};

/**
 * Validate company name
 * @param {string} companyName - Company name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateCompanyName = (companyName) => {
  if (!companyName || companyName.trim() === '') {
    return 'Company name is required';
  }
  
  if (companyName.trim().length < 2) {
    return 'Company name must be at least 2 characters long';
  }
  
  if (companyName.trim().length > 100) {
    return 'Company name must not exceed 100 characters';
  }
  
  return null;
};

/**
 * Validate description/text field
 * @param {string} description - Description to validate
 * @param {number} minLength - Minimum length (default: 10)
 * @param {number} maxLength - Maximum length (default: 5000)
 * @returns {string|null} Error message or null if valid
 */
export const validateDescription = (description, minLength = 10, maxLength = 5000) => {
  if (!description || description.trim() === '') {
    return 'Description is required';
  }
  
  if (description.trim().length < minLength) {
    return `Description must be at least ${minLength} characters long`;
  }
  
  if (description.trim().length > maxLength) {
    return `Description must not exceed ${maxLength} characters`;
  }
  
  return null;
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {string} type - File type ('image' or 'document')
 * @returns {string|null} Error message or null if valid
 */
export const validateFile = (file, type = 'document') => {
  if (!file) {
    return null; // File is optional
  }
  
  if (type === 'image') {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      return 'Only JPG, JPEG, and PNG images are allowed';
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      return 'Image size must not exceed 2MB';
    }
  }
  
  if (type === 'document') {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, DOC, and DOCX files are allowed';
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return 'Document size must not exceed 5MB';
    }
  }
  
  return null;
};

/**
 * Validate form with multiple fields
 * @param {Object} formData - Form data object
 * @param {Object} validations - Validation rules object
 * @returns {Object} Errors object with field names as keys
 */
export const validateForm = (formData, validations) => {
  const errors = {};
  
  Object.keys(validations).forEach((field) => {
    const validator = validations[field];
    const value = formData[field];
    
    if (typeof validator === 'function') {
      const error = validator(value);
      if (error) {
        errors[field] = error;
      }
    }
  });
  
  return errors;
};

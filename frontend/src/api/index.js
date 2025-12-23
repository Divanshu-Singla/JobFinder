// src/api/index.js

import axios from 'axios';

// Create an Axios instance with a base URL from environment variable
const API = axios.create({ 
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api' 
});

// This is a crucial part. On every request, this function will run first.
// It checks if we have a token in local storage and adds it to the request header.
API.interceptors.request.use((req) => {
  // Determine which token to use based on the request URL
  let token;
  
  if (req.url.includes('/admin')) {
    // Admin routes use adminToken
    token = localStorage.getItem('adminToken');
  } else if (req.url.includes('/users') || req.url.includes('/jobs')) {
    // User routes use userToken
    token = localStorage.getItem('userToken');
  } else {
    // For auth routes, check both (login doesn't need token)
    token = localStorage.getItem('userToken') || localStorage.getItem('adminToken');
  }
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Auth Routes ---
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);
export const loginAdmin = (formData) => API.post('/auth/admin/login', formData);


// --- User Routes ---
export const getUserProfile = () => API.get('/users/profile');

// --- Admin Routes ---
// This is an example, you would add more admin api calls here
export const getAdminProfile = () => API.get('/admin/profile'); // Assuming you create this route/controller

// Add other API calls for jobs, users, etc. as needed
// Add this to src/api/index.js

// --- Job Routes ---
export const fetchJobs = (params) => API.get('/jobs', { params });

export const fetchJobById = (id) => API.get(`/jobs/${id}`);
export const applyForJob = (id) => API.post(`/users/jobs/${id}/apply`);
export const withdrawApplication = (id) => API.delete(`/users/jobs/${id}/withdraw`);

// --- Bookmark Routes ---
export const bookmarkJob = (id) => API.post(`/users/jobs/${id}/bookmark`);
export const removeBookmark = (id) => API.delete(`/users/jobs/${id}/bookmark`);
export const getBookmarkedJobs = () => API.get('/users/bookmarked-jobs');

// Add these to src/api/index.js

export const updateUserProfile = (formData) => API.put('/users/profile', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
// Add these to the end of src/api/index.js

// --- Admin Job Management ---
export const adminAddJob = (jobData) => API.post('/admin/jobs', jobData);
export const adminUpdateJob = (id, jobData) => API.put(`/admin/jobs/${id}`, jobData);
export const adminDeleteJob = (id) => API.delete(`/admin/jobs/${id}`);
export const adminGetJobApplicants = (jobId) => API.get(`/admin/jobs/${jobId}/applicants`);

// --- Admin User Management ---
export const adminGetAllUsers = () => API.get('/admin/users');

// --- Admin Management (for Default Admin) ---
export const adminGetAllAdmins = () => API.get('/admin');
export const adminAddAdmin = (adminData) => API.post('/admin/add', adminData);
export const adminDeleteAdmin = (id) => API.delete(`/admin/${id}`);

// --- Application Status Management ---
export const adminUpdateApplicationStatus = (jobId, userId, status) => 
  API.put('/admin/application-status', { jobId, userId, status });

export const getAppliedJobs = () => API.get('/users/applied-jobs');

export default API;
// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import theme from './theme';

// Import Page Components
import HomePage from './pages/HomePage';
import JobDetailsPage from './pages/JobDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLoginPage from './pages/AdminLoginPage';
import UserDashboard from './pages/UserDashboard';
import MyApplicationsPage from './pages/MyApplicationsPage';
import BookmarkedJobsPage from './pages/BookmarkedJobsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminJobsPage from './pages/AdminJobsPage';
import AdminApplicantsPage from './pages/AdminApplicantsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminAdminsPage from './pages/AdminAdminsPage';

// Import Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationSnackbar from './components/NotificationSnackbar';

// Import Protected Route Components
import UserProtectedRoute from './components/UserProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalizes CSS across browsers */}
      <NotificationSnackbar />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box component="main" sx={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/browse" element={<HomePage />} />

          {/* User Protected Routes */}
          <Route element={<UserProtectedRoute />}>
            <Route path="/" element={<MyApplicationsPage />} />
            <Route path="/applications" element={<MyApplicationsPage />} />
            <Route path="/bookmarks" element={<BookmarkedJobsPage />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-jobs" element={<AdminJobsPage />} />
            <Route path="/admin-jobs/:jobId/applicants" element={<AdminApplicantsPage />} />
            <Route path="/admin-users" element={<AdminUsersPage />} />
            <Route path="/admin-admins" element={<AdminAdminsPage />} />
          </Route>
        </Routes>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
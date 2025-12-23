// src/components/AdminProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminProtectedRoute = () => {
  const { admin, loading } = useAuth(); // Get the real admin state

  if (loading) {
    return <div>Loading...</div>;
  }
  
  // If an admin exists, show the admin page.
  // If not, redirect to the admin login page.
  return admin ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default AdminProtectedRoute;
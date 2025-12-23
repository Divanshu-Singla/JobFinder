// src/components/UserProtectedRoute.js

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserProtectedRoute = () => {
  // We are now getting the real user and loading state from our context.
  const { user, loading } = useAuth(); 

  // The mock data block has been removed.

  if (loading) {
    // This shows a loading message while the context checks for a token.
    return <div>Loading...</div>;
  }
  
  // If a user exists, show the requested page.
  // If not, redirect to the login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default UserProtectedRoute;
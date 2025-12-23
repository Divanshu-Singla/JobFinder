// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api';

// Create the context
const AuthContext = createContext(null);

// Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // This effect runs on initial app load to check for an existing token
  useEffect(() => {
    const initializeAuth = async () => {
      // Remove old single token if it exists (migration cleanup)
      const oldToken = localStorage.getItem('token');
      if (oldToken) {
        localStorage.removeItem('token');
      }
      
      const userToken = localStorage.getItem('userToken');
      const adminToken = localStorage.getItem('adminToken');
      
      // Initialize user if user token exists
      if (userToken) {
        try {
          const decoded = jwtDecode(userToken);
          
          // Check token expiration
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('userToken');
            setUser(null);
          } else if (decoded.user) {
            // Fetch full user profile
            const { data } = await API.get('/users/profile', {
              headers: { Authorization: `Bearer ${userToken}` }
            });
            setUser(data);
          }
        } catch (error) {
          console.error("Invalid user token:", error);
          localStorage.removeItem('userToken');
          setUser(null);
        }
      }
      
      // Initialize admin if admin token exists
      if (adminToken) {
        try {
          const decoded = jwtDecode(adminToken);
          
          // Check token expiration
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('adminToken');
            setAdmin(null);
          } else if (decoded.admin) {
            setAdmin({ id: decoded.admin.id, isDefault: decoded.admin.isDefault });
          }
        } catch (error) {
          console.error("Invalid admin token:", error);
          localStorage.removeItem('adminToken');
          setAdmin(null);
        }
      }
      
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const loginUser = async (email, password) => {
    try {
      console.log('Attempting login to:', process.env.REACT_APP_API_BASE_URL);
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('userToken', data.token);
      const { data: profile } = await API.get('/users/profile', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      setUser(profile);
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      throw error;
    }
  };
  
  const loginAdmin = async (username, password) => {
    const { data } = await API.post('/auth/admin/login', { username, password });
    localStorage.setItem('adminToken', data.token);
    const decoded = jwtDecode(data.token);
    setAdmin({ id: decoded.admin.id, isDefault: decoded.admin.isDefault });
  };
  
  const registerUser = async (name, email, password, gender) => {
    try {
      const { data } = await API.post('/auth/register', { name, email, password, gender });
      // Don't auto-login after registration, just return success
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    setUser(null);
    setAdmin(null);
  };
  
  const logoutUser = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };
  
  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };
  
  const refreshUser = async () => {
    try {
      const userToken = localStorage.getItem('userToken');
      if (userToken) {
        // Refetch the user's profile from the backend
        const { data } = await API.get('/users/profile', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setUser(data);
      }
    } catch (error) {
      // If the token is invalid or expired, it will throw an error
      console.error("Failed to refresh user, logging out user.", error);
      logoutUser();
    }
  };

  // The value provided to the context consumers
  const value = {
    user,
    admin,
    loading,
    setUser,
    loginUser,
    loginAdmin,
    registerUser,
    logout,
    logoutUser,
    logoutAdmin,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context easily
export const useAuth = () => {
  return useContext(AuthContext);
};
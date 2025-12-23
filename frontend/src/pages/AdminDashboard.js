// src/pages/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import API from '../api';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress
} from '@mui/material';

const AdminDashboard = () => {
  const { socket, addNotification } = useSocket();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen for new applications via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleNewApplication = (data) => {
      console.log('New application received:', data);
      addNotification(data);
      
      // Refresh stats to show updated count
      fetchDashboardData();
    };

    socket.on('new-application', handleNewApplication);

    return () => {
      socket.off('new-application', handleNewApplication);
    };
  }, [socket, addNotification]);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/jobs')
      ]);
      setStats(statsRes.data);
      setRecentJobs(jobsRes.data.slice(0, 5)); // Get first 5 jobs
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.4)'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.totalAdmins || 0}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Total Admins
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(240, 147, 251, 0.4)'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.totalJobs || 0}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Total Jobs Posted
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(79, 172, 254, 0.4)'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.totalApplications || 0}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Total Applications
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(67, 233, 123, 0.4)'
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
              {stats?.totalUsers || 0}
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              Registered Users
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Jobs Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Recent Jobs
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Job Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Applicants</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Posted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <TableRow key={job._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{job.title}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>₹{job.salary?.toLocaleString('en-IN')}</TableCell>
                    <TableCell>{job.applicants?.length || 0}</TableCell>
                    <TableCell>{new Date(job.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ color: '#999', py: 4 }}>
                    No jobs posted yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button
            variant="contained"
            onClick={() => navigate('/admin-jobs')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            View All Jobs
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
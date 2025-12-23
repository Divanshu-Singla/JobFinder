// src/pages/MyApplicationsPage.js
import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { getAppliedJobs } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const getStatusColor = (status) => {
  const colors = {
    pending: 'warning',
    reviewed: 'info',
    shortlisted: 'primary',
    accepted: 'success',
    rejected: 'error'
  };
  return colors[status] || 'default';
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Pending',
    reviewed: 'Under Review',
    shortlisted: 'Shortlisted',
    accepted: 'Accepted',
    rejected: 'Rejected'
  };
  return labels[status] || status;
};

const MyApplicationsPage = () => {
  const { user } = useAuth();
  const { socket, addNotification } = useSocket();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        setLoading(true);
        const { data } = await getAppliedJobs();
        setAppliedJobs(data);
      } catch (error) {
        console.error("Failed to fetch applied jobs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAppliedJobs();
  }, []);

  // Listen for application status updates via WebSocket
  useEffect(() => {
    if (!socket || !user) return;

    const handleStatusUpdate = (data) => {
      console.log('Application status updated:', data);
      
      // Add to notifications
      addNotification(data);
      
      // Update local state
      setAppliedJobs(prev => 
        prev.map(job => 
          job._id === data.jobId 
            ? { ...job, applicationStatus: data.status }
            : job
        )
      );
    };

    socket.on('application-status-updated', handleStatusUpdate);

    return () => {
      socket.off('application-status-updated', handleStatusUpdate);
    };
  }, [socket, user, addNotification]);

  // Sort applications: Accepted/Rejected at top, then Pending
  const sortedApplications = useMemo(() => {
    return [...appliedJobs].sort((a, b) => {
      const statusA = (a.applicationStatus || 'pending').toLowerCase();
      const statusB = (b.applicationStatus || 'pending').toLowerCase();
      
      // Priority: accepted/rejected first, then pending
      const getPriority = (status) => {
        if (status === 'accepted' || status === 'rejected') return 0;
        return 1;
      };
      
      const priorityDiff = getPriority(statusA) - getPriority(statusB);
      if (priorityDiff !== 0) return priorityDiff;
      
      // Within same priority, sort by applied date (newest first)
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    });
  }, [appliedJobs]);

  if (!user) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            My Applications
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track all your job applications in one place
          </Typography>
          
          {/* Status Summary */}
          {appliedJobs.length > 0 && (
            <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip 
                label={`Total: ${appliedJobs.length}`}
                sx={{ fontWeight: 600 }}
              />
              <Chip 
                label={`✓ Accepted: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'accepted').length}`}
                sx={{ 
                  backgroundColor: '#e8f5e9',
                  color: '#2e7d32',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`✗ Rejected: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'rejected').length}`}
                sx={{ 
                  backgroundColor: '#ffebee',
                  color: '#c62828',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={`⏳ Pending: ${appliedJobs.filter(j => (j.applicationStatus || 'pending').toLowerCase() === 'pending').length}`}
                sx={{ 
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                  fontWeight: 600
                }}
              />
            </Box>
          )}
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : appliedJobs.length > 0 ? (
          <Grid container spacing={3}>
            {sortedApplications.map((job) => {
              const status = (job.applicationStatus || 'pending').toLowerCase();
              const isAccepted = status === 'accepted';
              const isRejected = status === 'rejected';
              const isUpdated = isAccepted || isRejected;
              
              return (
                <Grid item xs={12} md={6} lg={4} key={job._id}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      border: isAccepted ? '2px solid #4caf50' : isRejected ? '2px solid #f44336' : '1px solid #e0e0e0',
                      boxShadow: isUpdated ? 3 : 1,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: isUpdated ? 6 : 4
                      }
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.companyName}
                          </Typography>
                        </Box>
                        {isUpdated && (
                          <Chip 
                            label="Updated" 
                            size="small" 
                            sx={{ 
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              height: '20px'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography variant="h6" gutterBottom fontWeight="bold">
                        {job.title}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.location}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CurrencyRupeeIcon sx={{ fontSize: 18, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {job.salary ? `₹${job.salary.toLocaleString('en-IN')} LPA` : 'Not disclosed'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                        <Chip 
                          label={`${job.experienceRequired} years`} 
                          size="small" 
                          icon={<WorkIcon />}
                        />
                        
                        {/* Enhanced Status Chip */}
                        {isAccepted ? (
                          <Chip 
                            label="✓ ACCEPTED"
                            size="medium"
                            icon={<CheckCircleIcon />}
                            sx={{ 
                              backgroundColor: '#4caf50',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              px: 1,
                              '& .MuiChip-icon': { color: 'white' },
                              boxShadow: '0 2px 8px rgba(76, 175, 80, 0.4)',
                              animation: 'pulse 2s ease-in-out infinite',
                              '@keyframes pulse': {
                                '0%, 100%': { transform: 'scale(1)' },
                                '50%': { transform: 'scale(1.05)' }
                              }
                            }}
                          />
                        ) : isRejected ? (
                          <Chip 
                            label="✗ REJECTED"
                            size="medium"
                            icon={<CancelIcon />}
                            sx={{ 
                              backgroundColor: '#f44336',
                              color: 'white',
                              fontWeight: 700,
                              fontSize: '0.85rem',
                              px: 1,
                              '& .MuiChip-icon': { color: 'white' },
                              boxShadow: '0 2px 8px rgba(244, 67, 54, 0.4)'
                            }}
                          />
                        ) : (
                          <Chip 
                            label={getStatusLabel(status)}
                            size="small" 
                            color={getStatusColor(status)}
                          />
                        )}
                      </Box>
                      
                      {job.appliedAt && (
                        <Typography variant="caption" color="text.secondary">
                          Applied: {new Date(job.appliedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </Typography>
                      )}
                    </CardContent>
                    
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        component={RouterLink} 
                        to={`/jobs/${job._id}`}
                        variant="outlined"
                        fullWidth
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Applications Yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You haven't applied for any jobs yet. Start exploring opportunities!
            </Typography>
            <Button 
              component={RouterLink} 
              to="/browse" 
              variant="contained"
              size="large"
            >
              Browse Jobs
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default MyApplicationsPage;

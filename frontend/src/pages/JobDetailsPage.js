// src/pages/JobDetailsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { fetchJobById, applyForJob } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Grid
} from '@mui/material';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { user, refreshUser } = useAuth(); // Get the new refreshUser function

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [actionInProgress, setActionInProgress] = useState(false);

  useEffect(() => {
    const loadJobDetails = async () => {
      try {
        setLoading(true);
        const { data } = await fetchJobById(id);
        setJob(data);

        // Check if the current logged-in user has applied for this job
        // appliedJobs is an array of objects with jobId property
        if (user && user.appliedJobs?.some(app => app.jobId === id)) {
          setHasApplied(true);
        } else {
          setHasApplied(false);
        }
      } catch (err) {
        setError('Job not found or an error occurred.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobDetails();
  }, [id, user]); // Rerun when id or user object changes

  const handleApply = async () => {
    setActionInProgress(true);
    try {
      await applyForJob(id);
      setHasApplied(true);
      await refreshUser(); // <-- REFRESH aFTER APPLYING
    } catch (err) {
      console.error(err);
    } finally {
      setActionInProgress(false);
    }
  };
  
  const renderContent = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }
    if (job) {
      return (
        <Paper 
          elevation={0}
          sx={{ 
            p: 5,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>{job.title}</Typography>
              <Typography variant="h6" color="text.secondary">{job.companyName}</Typography>
            </Box>
            <Box sx={{ minWidth: 150, textAlign: 'right' }}>
              {user ? (
                hasApplied ? (
                  <Button 
                    variant="contained" 
                    color="success" 
                    disabled
                    sx={{ 
                      cursor: 'not-allowed',
                      '&.Mui-disabled': {
                        backgroundColor: 'success.main',
                        color: 'white',
                        opacity: 0.8
                      }
                    }}
                  >
                    Applied
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    onClick={handleApply} 
                    disabled={actionInProgress}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      fontWeight: 600,
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 4px 14px rgba(102,126,234,0.4)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(102,126,234,0.5)'
                      }
                    }}
                  >
                    {actionInProgress ? 'Applying...' : 'Apply Now'}
                  </Button>
                )
              ) : (
                <Button variant="contained" component={RouterLink} to="/login">Login to Apply</Button>
              )}
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
          {/* ... (rest of the JSX is the same) ... */}
          <Grid container spacing={2} sx={{ my: 2 }}>
            <Grid item xs={12} sm={4}>
              <Typography variant="overline" color="text.secondary">Location</Typography>
              <Typography variant="body1">{job.location}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="overline" color="text.secondary">Salary</Typography>
              <Typography variant="body1">₹{job.salary.toLocaleString('en-IN')} / year</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="overline" color="text.secondary">Experience</Typography>
              <Typography variant="body1">{job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired} years`}</Typography>
            </Grid>
          </Grid>
          <Typography variant="h6" sx={{ mt: 4 }}>Job Description</Typography>
          <Typography variant="body1" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
            {job.description}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return <Container sx={{ my: 4 }}>{renderContent()}</Container>;
};

export default JobDetailsPage;
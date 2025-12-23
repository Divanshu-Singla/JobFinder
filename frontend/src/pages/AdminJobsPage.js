// src/pages/AdminJobsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import {
  Container,
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem
} from '@mui/material';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    companyName: '',
    location: '',
    salary: '',
    experienceRequired: '',
    description: '',
    jobType: 'Full-time'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/admin/jobs');
      setJobs(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      setMessage('Job deleted successfully');
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setMessage('Error deleting job');
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewJob({
      title: '',
      companyName: '',
      location: '',
      salary: '',
      experienceRequired: '',
      description: '',
      jobType: 'Full-time'
    });
  };

  const handleInputChange = (e) => {
    setNewJob({ ...newJob, [e.target.name]: e.target.value });
  };

  const handleCreateJob = async () => {
    try {
      await API.post('/admin/jobs', newJob);
      setMessage('Job created successfully');
      handleCloseDialog();
      fetchJobs();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error creating job:', error);
      setMessage('Error creating job');
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
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Manage Jobs
          </Typography>
          <Button
            variant="contained"
            onClick={handleOpenDialog}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            + Add New Job
          </Button>
        </Box>

        {message && (
          <Box sx={{ p: 2 }}>
            <Alert severity="success">{message}</Alert>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Company</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Salary</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Applicants</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <TableRow key={job._id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{job.title}</TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>₹{job.salary?.toLocaleString('en-IN')}</TableCell>
                    <TableCell>
                      {job.experienceRequired === 0 ? 'Fresher' : `${job.experienceRequired} years`}
                    </TableCell>
                    <TableCell>{job.applicants?.length || 0}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => navigate(`/admin-jobs/${job._id}/applicants`)}
                        sx={{
                          mr: 1,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          textTransform: 'none'
                        }}
                      >
                        View Applicants
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(job._id)}
                        sx={{ textTransform: 'none' }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ color: '#999', py: 4 }}>
                    No jobs available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin-dashboard')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            ← Back to Dashboard
          </Button>
        </Box>
      </Paper>

      {/* Create Job Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Job Title"
            name="title"
            value={newJob.title}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={newJob.companyName}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={newJob.location}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Salary"
            name="salary"
            type="number"
            value={newJob.salary}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Experience Required (years)"
            name="experienceRequired"
            type="number"
            value={newJob.experienceRequired}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            select
            label="Job Type"
            name="jobType"
            value={newJob.jobType}
            onChange={handleInputChange}
            margin="normal"
          >
            <MenuItem value="Full-time">Full-time</MenuItem>
            <MenuItem value="Part-time">Part-time</MenuItem>
            <MenuItem value="Contract">Contract</MenuItem>
            <MenuItem value="Internship">Internship</MenuItem>
          </TextField>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={newJob.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleCreateJob}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none'
            }}
          >
            Create Job
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminJobsPage;

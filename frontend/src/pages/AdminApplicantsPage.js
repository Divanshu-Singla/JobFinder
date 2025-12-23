// src/pages/AdminApplicantsPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Avatar,
  MenuItem,
  Select,
  FormControl
} from '@mui/material';

const AdminApplicantsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const { data } = await API.get(`/admin/jobs/${jobId}/applicants`);
      setJob(data.job);
      // Ensure all applicants have a status field
      setApplicants(data.applicants.map(app => ({
        ...app,
        status: app.status || 'Pending'
      })));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicantId, newStatus) => {
    try {
      await API.patch(`/admin/jobs/${jobId}/applicants/${applicantId}/status`, {
        status: newStatus
      });
      
      // Update local state
      setApplicants(applicants.map(app => 
        app._id === applicantId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
      alert('Failed to update status. Please try again.');
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
        <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
            Applicants for: {job?.title}
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {job?.companyName} • {job?.location}
          </Typography>
        </Box>

        {applicants.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#f8fafc' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Applicant</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Resume</TableCell>
                  <TableCell sx={{ fontWeight: 600, minWidth: 180 }}>Application Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={applicant.profilePhoto ? `http://localhost:5000/${applicant.profilePhoto}` : undefined}
                          sx={{ width: 40, height: 40 }}
                        >
                          {applicant.name?.charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600 }}>
                          {applicant.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{applicant.email}</TableCell>
                    <TableCell>{applicant.experience} years</TableCell>
                    <TableCell>{applicant.gender || 'Not specified'}</TableCell>
                    <TableCell>{applicant.phone || 'N/A'}</TableCell>
                    <TableCell>
                      {applicant.resume ? (
                        <Button
                          size="small"
                          variant="contained"
                          href={`http://localhost:5000/${applicant.resume}`}
                          target="_blank"
                          sx={{ 
                            textTransform: 'none',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontWeight: 600
                          }}
                        >
                          📄 View Resume
                        </Button>
                      ) : (
                        <Typography sx={{ color: '#999', fontSize: '0.875rem' }}>
                          No resume
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={applicant.status || 'Pending'}
                          onChange={(e) => handleStatusChange(applicant._id, e.target.value)}
                          sx={{
                            fontWeight: 600,
                            '& .MuiSelect-select': {
                              py: 1,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#667eea',
                              borderWidth: 2
                            }
                          }}
                        >
                          <MenuItem value="Pending" sx={{ fontWeight: 600 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.2rem' }}>⏳</span>
                              <span>Pending</span>
                            </Box>
                          </MenuItem>
                          <MenuItem value="Accepted" sx={{ fontWeight: 600, color: '#16a34a' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.2rem' }}>✅</span>
                              <span>Accepted</span>
                            </Box>
                          </MenuItem>
                          <MenuItem value="Rejected" sx={{ fontWeight: 600, color: '#dc2626' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span style={{ fontSize: '1.2rem' }}>❌</span>
                              <span>Rejected</span>
                            </Box>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" sx={{ color: '#999', mb: 1 }}>
              No applicants yet
            </Typography>
            <Typography sx={{ color: '#999' }}>
              This job hasn't received any applications.
            </Typography>
          </Box>
        )}

        <Box sx={{ p: 3, borderTop: '1px solid #e2e8f0' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin-jobs')}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            ← Back to Jobs
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminApplicantsPage;

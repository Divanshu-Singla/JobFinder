// src/pages/AdminUsersPage.js

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
  Avatar,
  Alert
} from '@mui/material';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await API.delete(`/admin/users/${userId}`);
      setMessage('User deleted successfully');
      fetchUsers();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage('Error deleting user');
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
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
            Manage Users
          </Typography>
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
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Experience</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Resume</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={user.profilePhoto ? `http://localhost:5000/${user.profilePhoto}` : undefined}
                          sx={{ width: 40, height: 40 }}
                        >
                          {user.name?.charAt(0)}
                        </Avatar>
                        <Typography sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || 'N/A'}</TableCell>
                    <TableCell>{user.experience || 0} years</TableCell>
                    <TableCell>{user.gender || 'Not specified'}</TableCell>
                    <TableCell>
                      {user.resume ? (
                        <Button
                          size="small"
                          variant="contained"
                          href={`http://localhost:5000/${user.resume}`}
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
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(user._id)}
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
                    No users registered yet
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
    </Container>
  );
};

export default AdminUsersPage;

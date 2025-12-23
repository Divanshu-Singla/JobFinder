// src/pages/AdminAdminsPage.js

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
  Chip
} from '@mui/material';

const AdminAdminsPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState({ text: '', severity: 'success' });
  const [openDialog, setOpenDialog] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const { data } = await API.get('/admin/admins');
      setAdmins(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching admins:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;
    
    try {
      await API.delete(`/admin/admins/${adminId}`);
      setMessage({ text: 'Admin deleted successfully', severity: 'success' });
      await fetchAdmins();
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
    } catch (error) {
      console.error('Error deleting admin:', error);
      const errorMsg = error.response?.data?.msg || 'Error deleting admin';
      setMessage({ text: errorMsg, severity: 'error' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 5000);
    }
  };

  const handleCreateAdmin = async () => {
    // Validate input
    if (!newAdmin.username || !newAdmin.password) {
      setMessage({ text: 'Please fill in all fields', severity: 'warning' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
      return;
    }

    setCreating(true);
    try {
      await API.post('/admin/admins', newAdmin);
      
      // Close dialog and reset form
      setOpenDialog(false);
      setNewAdmin({ username: '', password: '' });
      
      // Refresh the admin list immediately
      await fetchAdmins();
      
      setMessage({ text: 'Admin created successfully', severity: 'success' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 3000);
    } catch (error) {
      console.error('Error creating admin:', error);
      const errorMsg = error.response?.data?.msg || 'Error creating admin';
      setMessage({ text: errorMsg, severity: 'error' });
      setTimeout(() => setMessage({ text: '', severity: 'success' }), 5000);
    } finally {
      setCreating(false);
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
            Manage Admins
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontWeight: 600,
              px: 3
            }}
          >
            + Add New Admin
          </Button>
        </Box>

        {message.text && (
          <Box sx={{ p: 2 }}>
            <Alert severity={message.severity}>{message.text}</Alert>
          </Box>
        )}

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Username</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{admin.username}</TableCell>
                  <TableCell>
                    {admin.isDefault ? (
                      <Chip label="Default Admin" color="primary" size="small" />
                    ) : (
                      <Chip label="Admin" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    {!admin.isDefault && (
                      <Button
                        size="small"
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(admin._id)}
                        sx={{ textTransform: 'none' }}
                      >
                        Delete
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
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

      {/* Create Admin Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create New Admin</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={newAdmin.username}
            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateAdmin}
            variant="contained"
            disabled={creating}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none'
            }}
          >
            {creating ? <CircularProgress size={24} color="inherit" /> : 'Create Admin'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminAdminsPage;

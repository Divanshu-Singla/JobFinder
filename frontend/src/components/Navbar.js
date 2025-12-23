// src/components/Navbar.js

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorkIcon from '@mui/icons-material/Work';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AssignmentIcon from '@mui/icons-material/Assignment';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Navbar = () => {
  const { user, admin, logout } = useAuth(); 
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: '70px' }}>
          <WorkIcon sx={{ fontSize: 32, mr: 1.5 }} />
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            JobFinder
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {admin ? (
              // Admin Menu
              <>
                <Button 
                  color="inherit" 
                  component={Link}
                  to="/admin-dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Dashboard
                </Button>
                <Button 
                  color="inherit" 
                  component={Link}
                  to="/admin-jobs"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Jobs
                </Button>
                <Button 
                  color="inherit" 
                  component={Link}
                  to="/admin-users"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Users
                </Button>
                {admin.isDefault && (
                  <Button 
                    color="inherit" 
                    component={Link}
                    to="/admin-admins"
                    sx={{ 
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      px: 2,
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    Admins
                  </Button>
                )}
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  startIcon={<LogoutIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : user ? (
              // User Menu
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/browse"
                  startIcon={<BusinessCenterIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Browse Jobs
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/applications"
                  startIcon={<AssignmentIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  My Applications
                </Button>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/bookmarks"
                  startIcon={<BookmarkIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Bookmarks
                </Button>
                
                <IconButton
                  onClick={handleMenu}
                  sx={{ ml: 1 }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      width: 40,
                      height: 40,
                      border: '2px solid rgba(255,255,255,0.3)'
                    }}
                  >
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { handleClose(); navigate('/dashboard'); }}
                    sx={{ py: 1.5, px: 2 }}
                  >
                    <DashboardIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    My Profile
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { handleClose(); handleLogout(); }}
                    sx={{ py: 1.5, px: 2, color: 'error.main' }}
                  >
                    <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              // Guest Menu
              <>
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  startIcon={<PersonIcon />}
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 500,
                    px: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                  }}
                >
                  Login
                </Button>
                <Button 
                  component={Link} 
                  to="/register"
                  variant="contained"
                  sx={{ 
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 3,
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
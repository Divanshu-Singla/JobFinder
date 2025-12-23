// src/theme.js

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Purple primary color
    },
    secondary: {
      main: '#764ba2', // Complementary purple
    },
    background: {
      default: '#f7fafc', // Light background
      paper: '#ffffff',   // White for cards and surfaces
    },
    text: {
      primary: '#2d3748',
      secondary: '#4a5568',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
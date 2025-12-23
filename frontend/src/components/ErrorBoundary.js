// src/components/ErrorBoundary.js
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: 3,
            textAlign: 'center',
            backgroundColor: '#f5f5f5'
          }}
        >
          <ErrorOutlineIcon 
            sx={{ 
              fontSize: 80, 
              color: '#f44336',
              mb: 2
            }} 
          />
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ color: '#333', fontWeight: 600 }}
          >
            Oops! Something went wrong
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ color: '#666', mb: 3, maxWidth: 500 }}
          >
            We're sorry for the inconvenience. The application encountered an unexpected error.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={this.handleReload}
            sx={{ 
              px: 4, 
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            Reload Page
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <Box 
              sx={{ 
                mt: 4, 
                p: 2, 
                backgroundColor: '#fff',
                borderRadius: 1,
                border: '1px solid #ddd',
                maxWidth: 600,
                textAlign: 'left',
                overflow: 'auto'
              }}
            >
              <Typography variant="subtitle2" color="error" gutterBottom>
                Error Details (Development Mode):
              </Typography>
              <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                {this.state.error.toString()}
              </Typography>
            </Box>
          )}
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

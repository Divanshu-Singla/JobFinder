// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'white',
        borderTop: '1px solid #e2e8f0',
        py: 1.5,
        textAlign: 'center',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="body2"
          sx={{
            margin: 0,
            color: '#64748b',
            fontSize: '0.9rem',
            fontWeight: 400
          }}
        >
          © {currentYear} JobPortal. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

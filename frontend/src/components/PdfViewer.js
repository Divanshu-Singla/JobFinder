// src/components/PdfViewer.js
import React from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const PdfViewer = ({ open, onClose, pdfUrl, title = "Resume" }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          height: '90vh',
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <span>{title}</span>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton
            component="a"
            href={pdfUrl}
            target="_blank"
            download
            sx={{ color: '#1976d2' }}
          >
            <DownloadIcon />
          </IconButton>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 0, height: 'calc(100% - 64px)' }}>
        <iframe
          src={pdfUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={title}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PdfViewer;

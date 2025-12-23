// src/pages/NewsPage.js

import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import API from '../api';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('technology');

  useEffect(() => {
    fetchNews();
  }, [category]);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get(`/news/${category}`);
      setNews(response.data.articles || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching news:', error);
      setError('Failed to load news. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const categories = [
    { value: 'technology', label: 'Technology' },
    { value: 'business', label: 'Business' },
    { value: 'science', label: 'Science' },
    { value: 'health', label: 'Health' },
  ];

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Category Filter - Simplified pill style */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              onClick={() => setCategory(cat.value)}
              sx={{
                px: 3,
                py: 2.5,
                fontSize: '0.95rem',
                fontWeight: 500,
                cursor: 'pointer',
                borderRadius: '50px',
                transition: 'all 0.2s',
                ...(category === cat.value
                  ? {
                      bgcolor: '#1976d2',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#1565c0',
                      },
                    }
                  : {
                      bgcolor: 'white',
                      color: '#555',
                      border: '1px solid #e0e0e0',
                      '&:hover': {
                        bgcolor: '#f5f5f5',
                        borderColor: '#1976d2',
                      },
                    }),
              }}
            />
          ))}
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={50} sx={{ color: '#1976d2' }} />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* News Grid - Clean card design */}
        {!loading && !error && news.length > 0 && (
          <Grid container spacing={2.5}>
            {news.map((article, index) => (
              <Grid item xs={12} sm={4} md={4} lg={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  {/* Image */}
                  {article.urlToImage ? (
                    <CardMedia
                      component="img"
                      sx={{
                        height: 200,
                        objectFit: 'cover',
                      }}
                      image={article.urlToImage}
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 200,
                        bgcolor: '#e3f2fd',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <NewspaperIcon sx={{ fontSize: 60, color: '#90caf9' }} />
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    {/* Source & Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#1976d2',
                          fontSize: '0.8rem',
                        }}
                      >
                        {article.source.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 14, color: '#999' }} />
                        <Typography variant="caption" sx={{ color: '#999', fontSize: '0.75rem' }}>
                          {formatDate(article.publishedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 2,
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                        color: '#1a1a1a',
                        height: '3em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {article.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        height: '4.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 3,
                      }}
                    >
                      {article.description || 'No description available.'}
                    </Typography>

                    {/* Spacer */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Read More Link */}
                    <Button
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                      sx={{
                        color: '#1976d2',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        justifyContent: 'flex-start',
                        px: 0,
                        '&:hover': {
                          bgcolor: 'transparent',
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* No News */}
        {!loading && !error && news.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <NewspaperIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h5" color="text.secondary">
              No news available at the moment.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default NewsPage;

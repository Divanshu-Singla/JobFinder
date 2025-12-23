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
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 2 }}>
            <NewspaperIcon sx={{ fontSize: 48, color: '#667eea' }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Latest News
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary">
            Stay updated with the latest headlines
          </Typography>
        </Box>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <Chip
              key={cat.value}
              label={cat.label}
              onClick={() => setCategory(cat.value)}
              sx={{
                px: 2,
                py: 3,
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                ...(category === cat.value
                  ? {
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                      },
                    }
                  : {
                      bgcolor: 'white',
                      color: '#667eea',
                      border: '2px solid #667eea',
                      '&:hover': {
                        bgcolor: '#f0f0ff',
                      },
                    }),
              }}
            />
          ))}
        </Box>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress size={60} sx={{ color: '#667eea' }} />
          </Box>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <Grid container spacing={4}>
            {news.map((article, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s',
                    borderRadius: 2,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
                    },
                  }}
                >
                  {/* Image */}
                  {article.urlToImage ? (
                    <CardMedia
                      component="img"
                      sx={{
                        height: 180,
                        objectFit: 'cover',
                      }}
                      image={article.urlToImage}
                      alt={article.title}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x180?text=No+Image';
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: 180,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <NewspaperIcon sx={{ fontSize: 60, color: 'rgba(255,255,255,0.5)' }} />
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 2.5, display: 'flex', flexDirection: 'column', minHeight: 220 }}>
                    {/* Source & Date */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: '#667eea',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        {article.source.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                          {formatDate(article.publishedAt)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Title */}
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        mb: 1.5,
                        fontSize: '1rem',
                        lineHeight: 1.4,
                        height: '2.8em',
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
                      color="text.secondary"
                      sx={{
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        height: '4.8em',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                      }}
                    >
                      {article.description || 'No description available.'}
                    </Typography>

                    {/* Spacer to push button to bottom */}
                    <Box sx={{ flexGrow: 1 }} />

                    {/* Read More Button */}
                    <Button
                      size="small"
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      endIcon={<OpenInNewIcon />}
                      fullWidth
                      sx={{
                        color: '#667eea',
                        fontWeight: 600,
                        justifyContent: 'center',
                        textTransform: 'none',
                        borderTop: '1px solid #f0f0f0',
                        borderRadius: 0,
                        py: 1,
                        mt: 'auto',
                        '&:hover': {
                          bgcolor: '#f8f8ff',
                        },
                      }}
                    >
                      Read Full Article
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

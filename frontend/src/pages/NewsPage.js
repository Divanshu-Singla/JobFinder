import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  Pagination
} from '@mui/material';
import { Newspaper as NewspaperIcon } from '@mui/icons-material';
import API from '../api';

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  
  const pageSize = 12;

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await API.get('/news', {
        params: {
          page,
          pageSize
        }
      });
      
      setNews(response.data.articles || []);
      setTotalResults(response.data.totalResults || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load news. Please try again later.');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalResults / pageSize);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <NewspaperIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Business News
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with the latest business and job market news from India
          </Typography>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <>
          {/* News Grid */}
          <Grid container spacing={3}>
            {news.map((article, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6
                    }
                  }}
                >
                  <CardActionArea 
                    component="a" 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    {article.urlToImage && (
                      <CardMedia
                        component="img"
                        height="180"
                        image={article.urlToImage}
                        alt={article.title}
                        sx={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Source & Date */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Chip 
                          label={article.source?.name || 'Unknown'} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(article.publishedAt)}
                        </Typography>
                      </Box>

                      {/* Title */}
                      <Typography 
                        variant="h6" 
                        component="h2" 
                        gutterBottom
                        sx={{
                          fontSize: '1rem',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          mb: 1
                        }}
                      >
                        {article.title}
                      </Typography>

                      {/* Description */}
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          flexGrow: 1
                        }}
                      >
                        {article.description || 'No description available.'}
                      </Typography>

                      {/* Author */}
                      {article.author && (
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ mt: 1, fontStyle: 'italic' }}
                        >
                          By {article.author}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* No Results */}
          {news.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                No news articles found
              </Typography>
            </Box>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default NewsPage;

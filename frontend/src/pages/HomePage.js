import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Container, Typography, Box, Grid, 
  Alert, Chip, Paper, Collapse, IconButton, Skeleton,
  Fade, Badge, Stack, alpha, Card, CardContent
} from '@mui/material';
import { 
  TextField, Select, MenuItem, FormControl, InputLabel, InputAdornment,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchJobs, getBookmarkedJobs } from '../api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import TuneIcon from '@mui/icons-material/Tune';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import JobCard from '../components/JobCard';

const HomePage = () => {
  const { user } = useAuth();
  const { socket, addNotification } = useSocket();
  const [jobs, setJobs] = useState([]);
  const [bookmarkedJobIds, setBookmarkedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState({ 
    search: '', 
    experience: '', 
    minSalary: '', 
    maxSalary: '',
    location: '' 
  });
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadJobs();
    if (user) {
      loadBookmarks();
    }
  }, [user]);

  // Listen for new jobs and deletions via WebSocket
  useEffect(() => {
    if (!socket || !user) return;

    const handleNewJob = (data) => {
      console.log('New job posted:', data);
      addNotification(data);
      
      // Add new job to list
      setJobs(prev => [data, ...prev]);
    };

    const handleJobDeleted = (data) => {
      console.log('Job deleted:', data);
      addNotification(data);
      
      // Remove job from list
      setJobs(prev => prev.filter(job => job._id !== data.jobId));
    };

    socket.on('new-job-posted', handleNewJob);
    socket.on('job-deleted', handleJobDeleted);

    return () => {
      socket.off('new-job-posted', handleNewJob);
      socket.off('job-deleted', handleJobDeleted);
    };
  }, [socket, user, addNotification]);

  // Debounced search for performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: searchInput }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await fetchJobs();
      setJobs(data);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const { data } = await getBookmarkedJobs();
      setBookmarkedJobIds(data.map(job => job._id));
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    }
  };

  const handleBookmarkChange = (jobId, isBookmarked) => {
    if (isBookmarked) {
      setBookmarkedJobIds(prev => [...prev, jobId]);
    } else {
      setBookmarkedJobIds(prev => prev.filter(id => id !== jobId));
    }
  };

  // Enhanced filtering and sorting algorithm with useMemo for performance
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Search filter with multi-field fuzzy matching
    if (filters.search && filters.search.trim()) {
      const searchTerms = filters.search.toLowerCase().trim().split(/\s+/);
      
      filtered = filtered.filter(job => {
        const searchableText = [
          job.title,
          job.companyName,
          job.location,
          job.description,
          ...(job.requirements || [])
        ].join(' ').toLowerCase();

        // Check if all search terms are present (AND logic)
        return searchTerms.every(term => searchableText.includes(term));
      });
    }

    // Experience filter - exact match or range
    if (filters.experience !== '') {
      const expValue = parseInt(filters.experience);
      filtered = filtered.filter(job => {
        if (expValue === 0) {
          return job.experienceRequired === 0; // Fresher only
        }
        return job.experienceRequired >= expValue && job.experienceRequired < expValue + 2;
      });
    }

    // Salary range filter
    if (filters.minSalary) {
      filtered = filtered.filter(job => job.salary >= parseInt(filters.minSalary));
    }
    if (filters.maxSalary) {
      filtered = filtered.filter(job => job.salary <= parseInt(filters.maxSalary));
    }

    // Location filter with partial matching
    if (filters.location && filters.location.trim()) {
      const locationTerms = filters.location.toLowerCase().trim().split(/\s+/);
      filtered = filtered.filter(job => 
        locationTerms.some(term => job.location.toLowerCase().includes(term))
      );
    }

    // Advanced sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'salary-high':
          return b.salary - a.salary;
        case 'salary-low':
          return a.salary - b.salary;
        case 'experience':
          return a.experienceRequired - b.experienceRequired;
        case 'company':
          return a.companyName.localeCompare(b.companyName);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [jobs, filters, sortBy]);

  const handleFilterChange = useCallback((e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', experience: '', minSalary: '', maxSalary: '', location: '' });
    setSearchInput('');
  }, []);

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Modern loading skeleton component
  const JobCardSkeleton = () => (
    <Card sx={{ height: '100%', borderRadius: 3 }}>
      <CardContent>
        <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 1 }} />
        <Skeleton variant="text" width="60%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="80%" height={20} sx={{ mb: 2 }} />
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
        </Box>
        <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2, 
            borderRadius: 2,
            '& .MuiAlert-icon': { fontSize: 28 }
          }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Hero Section - F-Pattern Layout with Visual Hierarchy */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #5e72e4 0%, #825ee4 50%, #5e72e4 100%)',
          color: 'white',
          pt: { xs: 8, sm: 10, md: 14 },
          pb: { xs: 10, sm: 12, md: 16 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '80px',
            background: 'linear-gradient(to top, #f8f9fa, transparent)'
          }
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            {/* Main Value Proposition - Left side (F-pattern) */}
            <Grid item xs={12} md={7}>
              <Fade in timeout={800}>
                <Box>
                  {/* Trust Badge */}
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                    label="Trusted by 10,000+ Job Seekers"
                    sx={{
                      mb: 3,
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      '& .MuiChip-icon': { color: 'white' }
                    }}
                  />
                  
                  {/* Primary Headline - Cognitive Load Reduction */}
                  <Typography 
                    variant="h1" 
                    sx={{ 
                      fontWeight: 900, 
                      mb: 3,
                      fontSize: { xs: '2.25rem', sm: '3rem', md: '3.75rem', lg: '4rem' },
                      lineHeight: 1.1,
                      textShadow: '0 4px 20px rgba(0,0,0,0.2)',
                      letterSpacing: '-1px'
                    }}
                  >
                    Your Dream Job
                    <br />
                    <Box component="span" sx={{ color: '#ffd700', fontWeight: 900 }}>Starts Here</Box>
                  </Typography>
                  
                  {/* Supporting Text - Clarity */}
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      opacity: 0.95,
                      mb: 4,
                      fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                      fontWeight: 400,
                      lineHeight: 1.6,
                      maxWidth: '600px'
                    }}
                  >
                    Connect with {jobs.length}+ verified opportunities from top companies. 
                    Find your perfect role in minutes, not months.
                  </Typography>
                  
                  {/* Social Proof Metrics - Trust Building */}
                  <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    spacing={{ xs: 2, sm: 4 }}
                    sx={{ mt: 4 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <WorkOutlineIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          {jobs.length}+
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                          Active Jobs
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <SpeedIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          2 Min
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                          Avg. Apply Time
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          bgcolor: 'rgba(255,255,255,0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <GroupsIcon sx={{ fontSize: 24 }} />
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                          500+
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                          Top Companies
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Box>
              </Fade>
            </Grid>
            
            {/* Trust Indicators - Right side */}
            <Grid item xs={12} md={5}>
              <Fade in timeout={1000}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: 4,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
                    Why Choose Us?
                  </Typography>
                  
                  <Stack spacing={2.5}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <SecurityIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                          100% Verified Jobs
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Every listing verified by our team
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'success.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <SpeedIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                          Quick Apply
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          Apply to multiple jobs in seconds
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: 'warning.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <VerifiedIcon />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                          Trusted Platform
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          10,000+ successful placements
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Jobs Section */}
      <Container sx={{ py: { xs: 6, sm: 8, md: 10 } }}>
        {/* Section Header with Progressive Disclosure */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2
        }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              Browse Opportunities
            </Typography>
          </Box>
          
          {/* Filter Toggle Button */}
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            sx={{ 
              bgcolor: showFilters ? 'primary.main' : 'white',
              color: showFilters ? 'white' : 'primary.main',
              border: '1px solid',
              borderColor: 'primary.main',
              boxShadow: showFilters ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none',
              '&:hover': { 
                bgcolor: showFilters ? 'primary.dark' : alpha('#667eea', 0.08),
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              },
              transition: 'all 0.3s'
            }}
          >
            <Badge 
              badgeContent={hasActiveFilters ? Object.values(filters).filter(v => v !== '').length : 0} 
              color="error"
            >
              <TuneIcon />
            </Badge>
          </IconButton>
        </Box>

        {/* Streamlined Search & Filter Bar */}
        <Collapse in={showFilters}>
          <Paper 
            elevation={0} 
            sx={{ 
              mb: 4, 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 3,
              border: '1px solid',
              borderColor: alpha('#5e72e4', 0.15),
              bgcolor: 'white',
              boxShadow: '0 2px 16px rgba(94, 114, 228, 0.08)'
            }}
          >
            {/* Inline Search & Filters */}
            <Grid container spacing={2} alignItems="flex-end">
              {/* Main Search - 40% width on desktop */}
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  size="medium"
                  name="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search job title, company, keywords..."
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      bgcolor: alpha('#f8f9fa', 0.6),
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#f8f9fa',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                      },
                      '&.Mui-focused': {
                        bgcolor: 'white',
                        boxShadow: `0 0 0 3px ${alpha('#5e72e4', 0.1)}`,
                        '& fieldset': {
                          borderColor: 'primary.main',
                          borderWidth: '2px'
                        }
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'primary.main', fontSize: 22 }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchInput && (
                      <InputAdornment position="end">
                        <IconButton 
                          size="small" 
                          onClick={() => setSearchInput('')}
                          sx={{ 
                            '&:hover': { 
                              color: 'error.main',
                              bgcolor: alpha('#f44336', 0.08)
                            }
                          }}
                        >
                          <ClearIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              {/* Experience Filter - 2 cols on desktop */}
              <Grid item xs={12} sm={4} md={2}>
                <FormControl 
                  fullWidth 
                  size="small"
                >
                  <InputLabel>Exp.</InputLabel>
                  <Select
                    name="experience"
                    value={filters.experience}
                    label="Exp."
                    onChange={handleFilterChange}
                    displayEmpty
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value={0}>Fresher</MenuItem>
                    <MenuItem value={1}>1-2 yrs</MenuItem>
                    <MenuItem value={3}>3-4 yrs</MenuItem>
                    <MenuItem value={5}>5-6 yrs</MenuItem>
                    <MenuItem value={7}>7+ yrs</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Min Salary"
                  name="minSalary"
                  type="number"
                  value={filters.minSalary}
                  onChange={handleFilterChange}
                  placeholder="5L"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={6} sm={3} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Salary"
                  name="maxSalary"
                  type="number"
                  value={filters.maxSalary}
                  onChange={handleFilterChange}
                  placeholder="15L"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CurrencyRupeeIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="City or Remote"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOnIcon fontSize="small" />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
            </Grid>

            {/* Compact Action Bar */}
            {(hasActiveFilters || filteredJobs.length > 0) && (
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                flexWrap: 'wrap',
                mt: 2.5,
                pt: 2,
                borderTop: '1px solid',
                borderColor: 'divider'
              }}>
                {/* Active Filters Pills */}
                <Stack 
                  direction="row" 
                  spacing={0.5} 
                  flexWrap="wrap" 
                  sx={{ gap: 0.5, flex: 1 }}
                >
                  {filters.search && (
                    <Chip 
                      label={filters.search.length > 15 ? filters.search.substring(0, 15) + '...' : filters.search}
                      onDelete={() => { setFilters(prev => ({ ...prev, search: '' })); setSearchInput(''); }}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.experience !== '' && (
                    <Chip 
                      label={filters.experience === '0' ? 'Fresher' : `${filters.experience}+ yrs`}
                      onDelete={() => setFilters(prev => ({ ...prev, experience: '' }))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {filters.location && (
                    <Chip 
                      label={filters.location}
                      onDelete={() => setFilters(prev => ({ ...prev, location: '' }))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {(filters.minSalary || filters.maxSalary) && (
                    <Chip 
                      label={`₹${filters.minSalary || '0'}-${filters.maxSalary || '∞'}`}
                      onDelete={() => setFilters(prev => ({ ...prev, minSalary: '', maxSalary: '' }))}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  
                  {/* Results Counter */}
                  <Chip 
                    label={`${filteredJobs.length} ${filteredJobs.length === 1 ? 'job' : 'jobs'}`}
                    size="small"
                    sx={{ 
                      bgcolor: 'success.main', 
                      color: 'white',
                      fontWeight: 600,
                      '& .MuiChip-label': { px: 1.5 }
                    }}
                  />
                </Stack>
                
                {/* Sort & Clear Actions */}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="recent">Recent</MenuItem>
                      <MenuItem value="salary-high">High Salary</MenuItem>
                      <MenuItem value="salary-low">Low Salary</MenuItem>
                      <MenuItem value="experience">Experience</MenuItem>
                      <MenuItem value="company">Company</MenuItem>
                    </Select>
                  </FormControl>

                  {hasActiveFilters && (
                    <Button 
                      variant="outlined" 
                      size="small"
                      onClick={handleClearFilters}
                      startIcon={<ClearIcon />}
                      sx={{ whiteSpace: 'nowrap' }}
                    >
                      Clear
                    </Button>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
        </Collapse>

        {/* Jobs Grid/List with Loading States */}
        {loading ? (
          <Grid container spacing={3}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <JobCardSkeleton />
              </Grid>
            ))}
          </Grid>
        ) : filteredJobs.length === 0 ? (
          <Fade in timeout={500}>
            <Paper 
              elevation={0} 
              sx={{ 
                textAlign: 'center', 
                py: 10,
                borderRadius: 4,
                border: '2px dashed',
                borderColor: 'divider',
                bgcolor: 'white'
              }}
            >
              <WorkOutlineIcon sx={{ fontSize: 100, color: 'text.disabled', mb: 3, opacity: 0.5 }} />
              <Typography variant="h5" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                No jobs found matching your criteria
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Try adjusting your search filters or explore all available positions
              </Typography>
              {hasActiveFilters && (
                <Button 
                  variant="contained" 
                  onClick={handleClearFilters}
                  startIcon={<ClearIcon />}
                  size="large"
                  sx={{ borderRadius: 2, textTransform: 'none', px: 4 }}
                >
                  Clear All Filters
                </Button>
              )}
            </Paper>
          </Fade>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={job._id}
              >
                <Box>
                  <JobCard 
                    job={job} 
                    onViewDetails={handleViewDetails}
                    isBookmarked={bookmarkedJobIds.includes(job._id)}
                    onBookmarkChange={handleBookmarkChange}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
// backend/routes/api/news.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
const logger = require('../../config/logger');

// @route   GET /api/news
// @desc    Get latest business news from India
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 12 } = req.query;
    const apiKey = process.env.NEWS_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: 'News API key not configured' });
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'in',
        category: 'business',
        page: parseInt(page),
        pageSize: parseInt(pageSize),
        apiKey: apiKey
      },
      timeout: 10000
    });

    if (response.data.status === 'ok') {
      res.json({
        articles: response.data.articles || [],
        totalResults: response.data.totalResults || 0,
        page: parseInt(page),
        pageSize: parseInt(pageSize)
      });
    } else {
      throw new Error(response.data.message || 'Failed to fetch news');
    }
  } catch (error) {
    logger.error('News fetch error:', error.message);
    res.status(500).json({ 
      message: 'Failed to fetch news',
      error: error.response?.data?.message || error.message
    });
  }
});

module.exports = router;

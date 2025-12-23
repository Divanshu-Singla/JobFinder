// backend/controllers/newsController.js

const axios = require('axios');
const logger = require('../config/logger');

// @desc    Get news by category
// @route   GET /api/news/:category
// @access  Public
const getNews = async (req, res) => {
  try {
    const { category = 'technology' } = req.params;
    
    const API_KEY = process.env.NEWS_API_KEY;
    
    if (!API_KEY) {
      logger.warn('NEWS_API_KEY not configured');
      return res.status(503).json({
        success: false,
        message: 'News service is not configured'
      });
    }
    
    const response = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=${category}&language=en&pageSize=20&apiKey=${API_KEY}`
    );
    
    logger.info(`Fetched news for category: ${category}`);
    
    res.json({
      success: true,
      articles: response.data.articles || []
    });
  } catch (error) {
    logger.error('Error fetching news:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch news',
      error: error.response?.data?.message || error.message
    });
  }
};

module.exports = { getNews };

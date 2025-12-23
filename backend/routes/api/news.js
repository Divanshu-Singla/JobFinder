// backend/routes/api/news.js

const express = require('express');
const router = express.Router();
const { getNews } = require('../../controllers/newsController');

// @route   GET /api/news/:category
// @desc    Get news by category
// @access  Public
router.get('/:category?', getNews);

module.exports = router;

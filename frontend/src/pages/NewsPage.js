// src/pages/NewsPage.js

import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaExternalLinkAlt, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
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
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaNewspaper className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Latest News</h1>
          </div>
          <p className="text-gray-600">Stay updated with the latest headlines</p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                category === cat.value
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-blue-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-5xl text-blue-600" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg text-center mb-8">
            {error}
          </div>
        )}

        {/* News Grid */}
        {!loading && !error && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-[520px]"
              >
                {/* Image */}
                {article.urlToImage ? (
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <FaNewspaper className="text-6xl text-white opacity-50" />
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Source & Date */}
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-500">
                    <span className="font-semibold text-blue-600">
                      {article.source.name}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2">
                    {article.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">
                    {article.description || "No description available."}
                  </p>

                  {/* Read More Button */}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    Read More
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No News */}
        {!loading && !error && news.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <FaNewspaper className="text-6xl mx-auto mb-4 opacity-30" />
            <p className="text-xl">No news available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

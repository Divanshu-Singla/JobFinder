// src/pages/NewsPage.js

import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaExternalLinkAlt, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import API from '../api';

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '32px 16px',
  },
  maxWidthContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  headerIcon: {
    fontSize: '48px',
    color: '#2563eb',
  },
  headerTitle: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0,
  },
  headerSubtitle: {
    color: '#6b7280',
    margin: 0,
  },
  categoryContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
  },
  categoryButton: {
    padding: '8px 24px',
    borderRadius: '50px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  categoryButtonActive: {
    backgroundColor: '#2563eb',
    color: 'white',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
  categoryButtonInactive: {
    backgroundColor: 'white',
    color: '#374151',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '80px 0',
  },
  spinnerIcon: {
    fontSize: '48px',
    color: '#2563eb',
    animation: 'spin 1s linear infinite',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #f87171',
    color: '#991b1b',
    padding: '24px',
    borderRadius: '8px',
    textAlign: 'center',
    marginBottom: '32px',
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: '24px',
  },
  newsCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s',
    display: 'flex',
    flexDirection: 'row',
    height: '250px',
  },
  newsImage: {
    width: '33.333%',
    height: '100%',
    objectFit: 'cover',
    flexShrink: 0,
  },
  newsImagePlaceholder: {
    width: '33.333%',
    height: '100%',
    background: 'linear-gradient(to bottom right, #60a5fa, #a78bfa)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  placeholderIcon: {
    fontSize: '60px',
    color: 'white',
    opacity: 0.5,
  },
  cardContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    width: '66.667%',
    overflow: 'hidden',
  },
  sourceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '12px',
    color: '#6b7280',
  },
  sourceName: {
    fontWeight: '600',
    color: '#2563eb',
  },
  dateRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  cardTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
  },
  cardDescription: {
    color: '#6b7280',
    fontSize: '13px',
    marginBottom: '12px',
    flexGrow: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.5',
  },
  readMoreLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    color: '#2563eb',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.3s',
    fontSize: '13px',
  },
  noNewsContainer: {
    textAlign: 'center',
    padding: '80px 0',
    color: '#6b7280',
  },
  noNewsIcon: {
    fontSize: '60px',
    margin: '0 auto 16px',
    opacity: 0.3,
  },
  noNewsText: {
    fontSize: '20px',
    margin: 0,
  },
};

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
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .news-card:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            transform: translateY(-4px);
          }
          .category-btn-inactive:hover {
            background-color: #dbeafe;
          }
          .read-more-link:hover {
            color: #1e40af;
          }
          @media (min-width: 768px) {
            .news-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (min-width: 1024px) {
            .news-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.maxWidthContainer}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerContent}>
              <FaNewspaper style={styles.headerIcon} />
              <h1 style={styles.headerTitle}>Latest News</h1>
            </div>
            <p style={styles.headerSubtitle}>Stay updated with the latest headlines</p>
          </div>

          {/* Category Filter */}
          <div style={styles.categoryContainer}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                style={{
                  ...styles.categoryButton,
                  ...(category === cat.value
                    ? styles.categoryButtonActive
                    : styles.categoryButtonInactive),
                }}
                className={category === cat.value ? '' : 'category-btn-inactive'}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div style={styles.loadingContainer}>
              <FaSpinner style={styles.spinnerIcon} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={styles.errorContainer}>
              {error}
            </div>
          )}

          {/* News Grid */}
          {!loading && !error && news.length > 0 && (
            <div style={styles.newsGrid} className="news-grid">
              {news.map((article, index) => (
                <div
                  key={index}
                  style={styles.newsCard}
                  className="news-card"
                >
                  {/* Content */}
                  <div style={styles.cardContent}>
                    {/* Source & Date */}
                    <div style={styles.sourceRow}>
                      <span style={styles.sourceName}>
                        {article.source.name}
                      </span>
                      <span style={styles.dateRow}>
                        <FaCalendarAlt />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 style={styles.cardTitle}>
                      {article.title}
                    </h3>

                    {/* Description */}
                    <p style={styles.cardDescription}>
                      {article.description || "No description available."}
                    </p>

                    {/* Read More Button */}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.readMoreLink}
                      className="read-more-link"
                    >
                      Read More
                      <FaExternalLinkAlt style={{ fontSize: '12px' }} />
                    </a>
                  </div>

                  {/* Image */}
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={styles.newsImage}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div style={styles.newsImagePlaceholder}>
                      <FaNewspaper style={styles.placeholderIcon} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No News */}
          {!loading && !error && news.length === 0 && (
            <div style={styles.noNewsContainer}>
              <FaNewspaper style={styles.noNewsIcon} />
              <p style={styles.noNewsText}>No news available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NewsPage;

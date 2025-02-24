import React from 'react';
import { FaChartBar, FaShareAlt } from 'react-icons/fa';
import './Analytics.css';

const Analytics = () => {
  // Mock data - replace with real data from your API
  const stats = {
    totalViews: 12500,
    totalShares: 450,
    topArticles: [
      { id: 1, title: "AI Breakthrough in Healthcare", views: 1200 },
      { id: 2, title: "New Tech Trends 2024", views: 980 },
      { id: 3, title: "Future of Remote Work", views: 850 }
    ]
  };

  return (
    <div className="analytics-container">
      <h1>Analytics Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <FaChartBar className="stat-icon" />
          <div className="stat-info">
            <h3>Total Views</h3>
            <p>{stats.totalViews.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <FaShareAlt className="stat-icon" />
          <div className="stat-info">
            <h3>Total Shares</h3>
            <p>{stats.totalShares.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="top-articles">
        <h2>Top Articles</h2>
        <div className="articles-list">
          {stats.topArticles.map(article => (
            <div key={article.id} className="article-stat">
              <h3>{article.title}</h3>
              <p>{article.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
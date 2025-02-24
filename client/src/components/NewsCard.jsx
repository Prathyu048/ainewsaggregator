import React from 'react';
import './NewsCard.css';

const NewsCard = ({ article }) => {
  if (!article) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="news-card">
      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title} 
          className="news-image"
          onError={(e) => e.target.style.display = 'none'}
        />
      )}
      <div className="news-content">
        <h3 className="news-title">{article.title}</h3>
        {article.description && (
          <p className="news-description">{article.description}</p>
        )}
        <div className="news-footer">
          <div className="news-meta">
            <span className="news-source">{article.source.name}</span>
            <span className="news-date">{formatDate(article.publishedAt)}</span>
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="read-more"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
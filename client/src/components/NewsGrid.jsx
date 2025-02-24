import React from 'react';
import NewsCard from './NewsCard';
import './NewsGrid.css';

const NewsGrid = ({ articles }) => {
  return (
    <div className="news-grid">
      {articles && articles.length > 0 ? (
        articles.map((article, index) => (
          <NewsCard key={index} article={article} />
        ))
      ) : (
        <div className="no-articles">No articles available.</div>
      )}
    </div>
  );
};

export default NewsGrid; 
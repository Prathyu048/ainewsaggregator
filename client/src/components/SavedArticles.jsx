import React from 'react';
import NewsCard from './NewsCard';
import './SavedArticles.css';

const SavedArticles = () => {
  // Mock data - replace with real saved articles from your storage
  const savedArticles = [
    {
      _id: '1',
      title: 'Health policy rider in term insurance',
      summary: 'Term insurance with critical illness rider provides lumpsum payment for specific illnesses, complementing health insurance for financial protection.',
      category: 'health',
      sentiment: 'positive',
      confidence: 0.85,
      source: 'Health News',
      publishedAt: new Date(),
    }
  ];

  return (
    <div className="saved-articles">
      <h1>Saved Articles</h1>
      {savedArticles.length > 0 ? (
        <div className="articles-grid">
          {savedArticles.map(article => (
            <NewsCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="no-articles">
          <p>No saved articles yet.</p>
        </div>
      )}
    </div>
  );
};

export default SavedArticles; 
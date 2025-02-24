import React, { useState, useEffect } from 'react';
import NewsCard from './components/NewsCard';

const Dashboard = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news?category=${category}&lang=${language}`);
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category, language]);

  return (
    <div>
      <h1>News Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="news-grid">
          {news.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard
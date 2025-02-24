import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import NewsGrid from './NewsGrid';
import TopicSidebar from './TopicSidebar';
import './Dashboard.css';

const Dashboard = ({ selectedLanguage }) => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('Technology');

  // Temporary hardcoded API key for testing
  const API_KEY = '928dbbf6af0cb1e827f0c93aa9b70f1e';
  const fetchNews = async (topic) => {
    try {
      setLoading(true);
      let url;

      const topicToCategory = {
        'Technology': 'technology',
        'Politics': 'world',
        'Economy': 'business',
        'Health': 'health',
        'Environment': 'science',
      };

      if (searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchQuery)}&lang=en&country=us&max=10&apikey=${API_KEY}`;
      } else {
        const category = topicToCategory[topic] || 'general';
        url = `https://gnews.io/api/v4/top-headlines?topic=${category}&lang=en&country=us&max=10&apikey=${API_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      console.log('GNews API Response:', data);

      if (data && Array.isArray(data.articles)) {
        const processedArticles = data.articles.map(article => ({
          title: article.title || 'No Title',
          description: article.description || 'No description available',
          url: article.url || '#',
          urlToImage: article.image || 'https://via.placeholder.com/150',
          publishedAt: article.publishedAt || new Date().toISOString(),
          source: {
            name: article.source?.name || 'Unknown Source'
          }
        }));
        setNews(processedArticles);
      } else {
        console.error('Error in API response:', data.errors || data.message || 'No articles found');
        setNews([]);
      }
    } catch (error) {
      console.error('Failed to fetch news:', error);
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      fetchNews(searchQuery);
    }
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setSearchQuery('');
    fetchNews(topic);
  };

  useEffect(() => {
    console.log('API Key:', API_KEY); // Debugging: Check if the API key is loaded
    fetchNews(selectedTopic);
  }, [selectedTopic]);

  return (
    <>
      <Helmet>
        <title>AI News Aggregator - Latest News</title>
        <meta name="description" content="Stay updated with the latest news." />
      </Helmet>
      
      <div className="dashboard">
        <div className="dashboard-layout">
          <TopicSidebar 
            onTopicSelect={handleTopicSelect}
            selectedTopic={selectedTopic}
            relatedArticles={news}
          />
          
          <div className="main-content">
            <div className="dashboard-header">
              <h1>Latest News - {selectedTopic}</h1>
              <div className="search-container">
                <input 
                  type="text" 
                  placeholder="Search for news..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch}>Search</button>
              </div>
            </div>

            {loading ? (
              <div className="loader">Loading...</div>
            ) : news.length > 0 ? (
              <NewsGrid articles={news} />
            ) : (
              <div className="no-articles">No articles available. Please try a different topic or search term.</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
const axios = require('axios');

class NewsApiService {
  constructor() {
    this.apiKey = process.env.NEWS_API_KEY;
    this.baseUrl = 'https://newsapi.org/v2';
  }

  async fetchTopHeadlines(category = 'general', language = 'en') {
    try {
      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          category,
          language,
          apiKey: this.apiKey,
        },
      });
      return response.data.articles; // Return the articles array
    } catch (error) {
      console.error('Error fetching top headlines:', error);
      throw error;
    }
  }

  async fetchArticlesByTopic(topic) {
    try {
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          q: topic, // Search for articles related to the topic
          apiKey: this.apiKey,
        },
      });
      return response.data.articles; // Return the articles array
    } catch (error) {
      console.error('Error fetching articles by topic:', error);
      throw error;
    }
  }

  // You can add more methods to classify articles into sub-topics if needed
}

module.exports = new NewsApiService(); 
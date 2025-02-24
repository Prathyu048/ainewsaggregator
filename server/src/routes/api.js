const express = require('express');
const router = express.Router();
const newsApiService = require('../services/newsApiService');
const { generateMockArticle } = require('../services/articleGenerator');

// Fetch articles from NewsAPI based on topic
router.get('/newsapi', async (req, res) => {
  try {
    const { topic, language } = req.query; // Get topic from query parameters
    const articles = await newsApiService.fetchArticlesByTopic(topic); // Fetch articles by topic
    res.json(articles); // Return the articles
  } catch (error) {
    console.error('Error fetching articles from NewsAPI:', error);
    res.status(500).json({ error: error.message });
  }
});

// Generate a mock article
router.get('/generate-article', (req, res) => {
  try {
    const article = generateMockArticle();
    res.json(article);
  } catch (error) {
    console.error('Error generating article:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
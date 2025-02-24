const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for articles
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  url: String,
  category: String,
  subCategory: String,
  source: String,
  publishedAt: Date,
});

const Article = mongoose.model('Article', articleSchema);

app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to the News API!'); // Simple response for the root URL
});

// API endpoint to fetch news
app.get('/api/fetch-news', async (req, res) => {
  const { category = 'general', lang = 'en' } = req.query;
  const url = `https://newsapi.org/v2/top-headlines?category=${category}&language=${lang}&apiKey=${process.env.NEWS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const articles = response.data.articles;

    // Save articles to MongoDB
    for (const article of articles) {
      await Article.create({
        title: article.title,
        content: article.description,
        url: article.url,
        category: category,
        subCategory: 'global', // Example sub-category
        source: article.source.name,
        publishedAt: new Date(article.publishedAt),
      });
    }

    res.json({ message: 'Articles fetched and stored successfully.' });
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// API endpoint to create a new article
app.post('/api/articles', async (req, res) => {
  const { title, content, url, category, subCategory, source, publishedAt } = req.body;

  try {
    const newArticle = await Article.create({
      title,
      content,
      url,
      category,
      subCategory,
      source,
      publishedAt: new Date(publishedAt),
    });
    res.status(201).json(newArticle); // Respond with the created article
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

// Scraping endpoint
app.get('/api/scrape-news', async (req, res) => {
  try {
    const { topic = 'technology' } = req.query;
    const response = await axios.get(`https://www.reuters.com/technology/`);
    const html = response.data;
    const $ = cheerio.load(html);
    const articles = [];

    // Reuters specific selectors
    $('article').each((index, element) => {
      const title = $(element).find('h3').text().trim();
      const description = $(element).find('p').text().trim();
      const relativeUrl = $(element).find('a').attr('href');
      const url = relativeUrl ? `https://www.reuters.com${relativeUrl}` : '';
      const publishedAt = new Date().toISOString();

      if (title && url) {
        articles.push({
          title,
          description,
          url,
          publishedAt,
          source: 'Reuters'
        });
      }
    });

    // Filter out any empty articles
    const validArticles = articles.filter(article => article.title && article.url);
    
    // Save to MongoDB
    await Article.insertMany(validArticles);

    res.json(validArticles);
  } catch (error) {
    console.error('Error scraping news:', error);
    res.status(500).json({ error: 'Failed to scrape news', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
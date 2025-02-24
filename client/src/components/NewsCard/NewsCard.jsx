const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Sample news data
const newsData = [
  { _id: 1, title: 'Tech News', summary: 'Latest updates in technology.', category: 'technology', lang: 'en' },
  { _id: 2, title: 'Sports Highlights', summary: 'Top sports events.', category: 'sports', lang: 'en' },
  { _id: 3, title: 'Political Insights', summary: 'Current political scenario.', category: 'politics', lang: 'en' },
  { _id: 4, title: 'Business Trends', summary: 'Market analysis and trends.', category: 'business', lang: 'en' },
  // Add more sample data as needed
];

// API endpoint to fetch news
app.get('/api/news', (req, res) => {
  const { category, lang } = req.query;
  const filteredNews = newsData.filter(article => 
    (category === 'all' || article.category === category) &&
    article.lang === lang
  );
  res.json(filteredNews);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
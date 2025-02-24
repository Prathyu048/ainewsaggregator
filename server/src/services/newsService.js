const axios = require('axios');
const cheerio = require('cheerio');
const nlpService = require('./nlpService');
const slugify = require('slugify');
const Article = require('../models/Article');
const imageService = require('./imageService');
const { translateText } = require('../../../client/src/components/translationService');

class NewsService {
  constructor() {
    this.sources = [
      {
        name: 'Reuters',
        url: 'https://www.reuters.com/world',
        selector: 'article',
        credibilityScore: 0.9,
        selectors: {
          title: 'h3.article-heading',
          content: '.article-body',
          date: 'time',
          author: '.author-name'
        }
      },
      {
        name: 'AP News',
        url: 'https://apnews.com',
        selector: '.FeedCard',
        credibilityScore: 0.9,
        selectors: {
          title: '.headline',
          content: '.content',
          date: '.timestamp',
          author: '.byline'
        }
      }
    ];
  }

  async fetchAndProcessNews() {
    try {
      for (const source of this.sources) {
        console.log(`Fetching news from ${source.name}...`);
        const articles = await this.scrapeSource(source);
        
        for (const article of articles) {
          try {
            // Process with NLP
            const processed = await this.processArticle(article);
            
            // Create article in the database
            await Article.create(processed);
            console.log(`Processed and stored article: ${processed.title}`);
          } catch (error) {
            console.error(`Error processing article from ${source.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in news processing:', error);
      throw error;
    }
  }

  async scrapeSource(source) {
    try {
      const response = await axios.get(source.url);
      const $ = cheerio.load(response.data);
      const articles = [];

      $(source.selector).each((_, element) => {
        const $element = $(element);
        const selectors = source.selectors;

        const article = {
          title: $element.find(selectors.title).text().trim(),
          originalContent: $element.find(selectors.content).text().trim(),
          url: this.normalizeUrl($element.find('a').attr('href'), source.url),
          author: $element.find(selectors.author).text().trim(),
          publishedAt: this.parseDate($element.find(selectors.date).text())
        };

        if (article.title && article.originalContent) {
          articles.push(article);
        }
      });

      console.log(`Scraped ${articles.length} articles from ${source.name}`);
      return articles;
    } catch (error) {
      console.error(`Error scraping ${source.name}:`, error);
      return [];
    }
  }

  async processArticle(article) {
    try {
      // Process with NLP
      const processed = await nlpService.processArticle(article);
      
      // Generate images
      const images = await imageService.generateArticleImages(processed);
      
      // Translate to Hindi
      const translations = await this.translateContent(processed);
      
      // Generate SEO data
      const seoData = this.generateSEO(processed);
      
      return {
        ...processed,
        images,
        translations,
        ...seoData
      };
    } catch (error) {
      console.error('Error processing article:', error);
      throw error;
    }
  }

  async translateContent(article) {
    try {
      const [titleHi, contentHi, summaryHi] = await Promise.all([
        translateText(article.title, 'hi'),
        translateText(article.processedContent, 'hi'),
        translateText(article.summary, 'hi')
      ]);

      return {
        hi: {
          title: titleHi,
          content: contentHi,
          summary: summaryHi
        }
      };
    } catch (error) {
      console.error('Translation error:', error);
      return null;
    }
  }

  generateSEO(article) {
    const slug = slugify(article.title, { lower: true, strict: true });
    const keywords = this.extractKeywords(article.processedContent);

    return {
      seo: {
        title: this.optimizeTitle(article.title),
        description: this.generateMetaDescription(article.summary),
        keywords,
        slug,
        metaTags: {
          ogTitle: article.title,
          ogDescription: article.summary,
          twitterCard: 'summary_large_image'
        }
      }
    };
  }

  optimizeTitle(title) {
    // Keep title between 50-60 characters
    return title.length > 60 ? `${title.substring(0, 57)}...` : title;
  }

  generateMetaDescription(summary) {
    // Keep description between 150-160 characters
    return summary.length > 160 ? `${summary.substring(0, 157)}...` : summary;
  }

  extractKeywords(content) {
    // Simple keyword extraction (replace with more sophisticated algorithm)
    const words = content.toLowerCase().split(/\W+/);
    const stopWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at']);
    return [...new Set(words)]
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 10);
  }

  calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  normalizeUrl(url, baseUrl) {
    try {
      return new URL(url, baseUrl).href;
    } catch {
      return url;
    }
  }

  parseDate(dateStr) {
    try {
      return new Date(dateStr);
    } catch {
      return new Date();
    }
  }
}

module.exports = new NewsService(); 
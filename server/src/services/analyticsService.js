const Article = require('../models/Article');

class AnalyticsService {
  async trackView(articleId, userId) {
    await Article.findByIdAndUpdate(articleId, {
      $inc: { 'analytics.views': 1 }
    });
  }

  async trackShare(articleId, platform) {
    await Article.findByIdAndUpdate(articleId, {
      $inc: {
        'analytics.shares.total': 1,
        [`analytics.shares.platforms.${platform}`]: 1
      }
    });
  }

  async trackEngagement(articleId, data) {
    const { readTime, scrollDepth } = data;
    await Article.findByIdAndUpdate(articleId, {
      $inc: {
        'analytics.engagement.readTime': readTime,
        'analytics.engagement.scrollDepth': scrollDepth
      }
    });
  }

  async updateSearchRanking(articleId, keyword, position) {
    await Article.findByIdAndUpdate(articleId, {
      $push: {
        'analytics.searchRankings': {
          keyword,
          position,
          date: new Date()
        }
      }
    });
  }

  async getArticleAnalytics(articleId) {
    return Article.findById(articleId).select('analytics');
  }

  async getTopArticles() {
    return Article.find({ status: 'published' })
      .sort({ 'analytics.views': -1 })
      .limit(10)
      .select('title analytics');
  }
}

module.exports = new AnalyticsService(); 
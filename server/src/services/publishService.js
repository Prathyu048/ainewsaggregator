const Article = require('../models/Article');

class PublishService {
  async publishArticle(articleId) {
    try {
      const article = await Article.findById(articleId);
      if (!article) {
        throw new Error('Article not found');
      }

      // Format article for publishing
      const formattedContent = this.formatContent(article);

      // Update article status
      article.status = 'published';
      article.publishedAt = new Date();
      await article.save();

      // Return formatted content
      return formattedContent;
    } catch (error) {
      console.error('Error publishing article:', error);
      throw error;
    }
  }

  formatContent(article) {
    return {
      title: article.title,
      content: article.processedContent,
      summary: article.summary,
      seo: article.seo,
      category: article.category,
      readingTime: article.readingTime,
      source: article.source,
      publishedAt: article.publishedAt
    };
  }

  async schedulePublishing(articleId, publishDate) {
    // Schedule article for future publishing
    const timeUntilPublish = new Date(publishDate) - new Date();
    if (timeUntilPublish > 0) {
      setTimeout(async () => {
        await this.publishArticle(articleId);
      }, timeUntilPublish);
    }
  }
}

module.exports = new PublishService(); 
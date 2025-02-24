const slugify = require('slugify');
const keywordExtractor = require('keyword-extractor');

class SEOService {
  async optimize(article) {
    const keywords = this.extractKeywords(article.content);
    const slug = this.generateSlug(article.title);
    
    return {
      ...article,
      seo: {
        title: this.optimizeTitle(article.title, keywords),
        description: this.generateMetaDescription(article.summary),
        keywords: keywords,
        slug: slug,
        structuredData: this.generateStructuredData(article, slug)
      }
    };
  }

  optimizeTitle(title, keywords) {
    // Keep title between 50-60 characters
    let seoTitle = title;
    if (title.length > 60) {
      seoTitle = title.substring(0, 57) + '...';
    }
    return seoTitle;
  }

  generateMetaDescription(summary) {
    // Keep description between 150-160 characters
    return summary.length > 160 ? 
      summary.substring(0, 157) + '...' : 
      summary;
  }

  extractKeywords(content) {
    return keywordExtractor.extract(content, {
      language: "english",
      remove_digits: true,
      return_changed_case: true,
      remove_duplicates: true
    }).slice(0, 10); // Keep top 10 keywords
  }

  generateSlug(title) {
    return slugify(title, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g
    });
  }

  generateStructuredData(article, slug) {
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.summary,
      "datePublished": article.publishedAt,
      "dateModified": new Date().toISOString(),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://yourdomain.com/news/${slug}`
      },
      "author": {
        "@type": "Organization",
        "name": article.metadata.source
      }
    };
  }
}

module.exports = new SEOService();
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalContent: {
    type: String,
    required: true
  },
  processedContent: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  translations: {
    hi: {
      title: String,
      content: String,
      summary: String
    }
  },
  images: [{
    url: String,
    alt: String,
    type: {
      type: String,
      enum: ['photo', 'infographic', 'chart'],
      default: 'photo'
    },
    generatedBy: {
      type: String,
      enum: ['stable-diffusion', 'dall-e', 'manual'],
      default: 'stable-diffusion'
    }
  }],
  seo: {
    title: String,
    description: String,
    keywords: [String],
    slug: {
      type: String,
      unique: true
    },
    metaTags: {
      ogTitle: String,
      ogDescription: String,
      twitterCard: String
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['politics', 'technology', 'business', 'sports', 'entertainment']
  },
  source: {
    name: String,
    url: String,
    credibilityScore: Number
  },
  analytics: {
    views: { type: Number, default: 0 },
    shares: {
      total: { type: Number, default: 0 },
      platforms: {
        facebook: { type: Number, default: 0 },
        twitter: { type: Number, default: 0 },
        linkedin: { type: Number, default: 0 }
      }
    },
    engagement: {
      readTime: { type: Number, default: 0 },
      scrollDepth: { type: Number, default: 0 },
      comments: { type: Number, default: 0 }
    },
    searchRankings: [{
      keyword: String,
      position: Number,
      date: Date
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  readingTime: Number
}, {
  timestamps: true
});

// Indexes for better performance
articleSchema.index({ category: 1, publishedAt: -1 });
articleSchema.index({ 'seo.keywords': 1 });
articleSchema.index({ 'seo.slug': 1 }, { unique: true });
articleSchema.index({ 'analytics.views': -1 });

module.exports = mongoose.model('Article', articleSchema); 
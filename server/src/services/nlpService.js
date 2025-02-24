const { pipeline } = require('@huggingface/transformers');
const config = require('../config/config');

class NLPService {
  constructor() {
    this.models = {};
    this.initialize();
  }

  async initialize() {
    try {
      // Initialize all models in parallel
      const [summarizer, classifier, sentiment, translator] = await Promise.all([
        pipeline('summarization', 'facebook/bart-large-cnn'),
        pipeline('zero-shot-classification', 'facebook/bart-large-mnli'),
        pipeline('sentiment-analysis', 'nlptown/bert-base-multilingual-uncased-sentiment'),
        pipeline('translation', 'Helsinki-NLP/opus-mt-en-hi')
      ]);

      this.models = { summarizer, classifier, sentiment, translator };
      console.log('NLP models initialized successfully');
    } catch (error) {
      console.error('Failed to initialize NLP models:', error);
      throw error;
    }
  }

  async processArticle(article) {
    const { title, content } = article;

    try {
      // Process all NLP tasks in parallel
      const [summary, classification, sentiment, translation] = await Promise.all([
        this.summarize(content),
        this.classify(content),
        this.analyzeSentiment(content),
        this.translate({ title, content })
      ]);

      return {
        ...article,
        summary,
        category: classification.label,
        sentiment: sentiment.label,
        confidence: sentiment.score,
        translations: {
          hi: translation
        }
      };
    } catch (error) {
      console.error('Error processing article:', error);
      throw error;
    }
  }

  async summarize(text) {
    const result = await this.models.summarizer(text, {
      max_length: 130,
      min_length: 30,
      do_sample: false
    });
    return result[0].summary_text;
  }

  async classify(text) {
    const result = await this.models.classifier(text, {
      candidate_labels: ['politics', 'technology', 'sports', 'business']
    });
    return {
      label: result.labels[0],
      score: result.scores[0]
    };
  }

  async analyzeSentiment(text) {
    const result = await this.models.sentiment(text);
    return {
      label: this.getSentimentLabel(result[0].score),
      score: result[0].score
    };
  }

  async translate({ title, content }) {
    const [translatedTitle, translatedContent] = await Promise.all([
      this.models.translator(title),
      this.models.translator(content)
    ]);

    return {
      title: translatedTitle[0].translation_text,
      content: translatedContent[0].translation_text
    };
  }

  getSentimentLabel(score) {
    if (score > 0.6) return 'positive';
    if (score < 0.4) return 'negative';
    return 'neutral';
  }
}

module.exports = new NLPService(); 
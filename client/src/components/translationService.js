const axios = require('axios');

class TranslationService {
  constructor() {
    this.apiKey = process.env.TRANSLATION_API_KEY; // Ensure this is set in your .env file
    this.baseUrl = 'https://api.example.com/translate'; // Replace with actual translation API URL
  }

  async translateText(text, targetLanguage) {
    try {
      const response = await axios.post(this.baseUrl, {
        q: text,
        target: targetLanguage,
        key: this.apiKey,
      });
      return response.data.translatedText; // Adjust based on the API response structure
    } catch (error) {
      console.error('Error translating text:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService(); 
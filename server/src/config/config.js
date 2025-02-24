module.exports = {
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost/newsai'
  },
  server: {
    port: process.env.PORT || 5000
  },
  huggingface: {
    apiKey: process.env.HUGGINGFACE_API_KEY
  },
  stableDiffusion: {
    apiUrl: process.env.SD_API_URL,
    apiKey: process.env.SD_API_KEY
  }
}; 
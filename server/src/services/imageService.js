const { StableDiffusionApi } = require('stable-diffusion-api');
const { createCanvas, loadImage } = require('canvas');
const Chart = require('chart.js/auto');

class ImageService {
  constructor() {
    this.sdApi = new StableDiffusionApi({
      baseUrl: process.env.SD_API_URL,
      apiKey: process.env.SD_API_KEY
    });
  }

  async generateArticleImages(article) {
    try {
      const images = [];

      // Generate main article image
      const mainImage = await this.generateMainImage(article.title);
      images.push(mainImage);

      // Generate infographic if article has statistics
      if (this.hasStatistics(article.processedContent)) {
        const infographic = await this.generateInfographic(article);
        images.push(infographic);
      }

      // Generate chart for data visualization
      if (this.hasNumericalData(article.processedContent)) {
        const chart = await this.generateChart(article);
        images.push(chart);
      }

      return images;
    } catch (error) {
      console.error('Error generating images:', error);
      return [];
    }
  }

  async generateMainImage(prompt) {
    const response = await this.sdApi.generateImage({
      prompt: prompt,
      negativePrompt: 'blurry, low quality, distorted',
      width: 1024,
      height: 576,
      steps: 30,
      seed: Math.floor(Math.random() * 1000000)
    });

    return {
      url: response.output[0],
      alt: prompt,
      type: 'photo',
      generatedBy: 'stable-diffusion'
    };
  }

  async generateInfographic(article) {
    // Create infographic using extracted data
    const canvas = createCanvas(800, 1200);
    const ctx = canvas.getContext('2d');
    
    // Add infographic elements
    // ... (infographic generation logic)

    return {
      url: canvas.toDataURL(),
      alt: `Infographic: ${article.title}`,
      type: 'infographic',
      generatedBy: 'stable-diffusion'
    };
  }

  async generateChart(article) {
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');

    // Extract data and create chart
    const data = this.extractChartData(article.processedContent);
    new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Data Visualization'
          }
        }
      }
    });

    return {
      url: canvas.toDataURL(),
      alt: 'Data visualization chart',
      type: 'chart',
      generatedBy: 'manual'
    };
  }

  hasStatistics(content) {
    // Check if content contains statistical data
    const statsPattern = /\d+%|\d+\s*(million|billion|trillion)|(\$|€|£)\d+/gi;
    return statsPattern.test(content);
  }

  hasNumericalData(content) {
    // Check if content has enough numerical data for a chart
    const numbers = content.match(/\d+/g) || [];
    return numbers.length >= 5;
  }

  extractChartData(content) {
    // Extract and structure data for charts
    // ... (data extraction logic)
    return {
      labels: [],
      datasets: []
    };
  }
}

module.exports = new ImageService(); 
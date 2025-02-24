function generateMockArticle() {
  return {
    title: "The Future of Technology",
    originalContent: "As technology continues to evolve, we are witnessing unprecedented changes in various sectors. From artificial intelligence to blockchain, the future looks promising.",
    summary: "This article discusses the future of technology and its impact on society.",
    category: "technology",
    status: "published",
    publishedAt: new Date(),
  };
}

module.exports = { generateMockArticle }; 
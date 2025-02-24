import React from 'react';
import './TopicSidebar.css';

// Define the topics with subtopics
const topics = {
  global: {
    name: 'Global News',
    subtopics: ['Politics', 'Technology', 'Economy', 'Health', 'Environment'],
  },
  local: {
    name: 'Local News',
    subtopics: ['Uttar Pradesh', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu'],
  },
};

const TopicSidebar = ({ onTopicSelect, selectedTopic }) => {
  return (
    <div className="topic-sidebar">
      <h3>Topics</h3>
      {Object.entries(topics).map(([key, topic]) => (
        <div key={key} className="topic-section">
          <h4>{topic.name}</h4>
          {topic.subtopics.map((subtopic) => (
            <div
              key={subtopic}
              className={`topic-header ${selectedTopic === subtopic ? 'active' : ''}`}
              onClick={() => onTopicSelect(subtopic)}
            >
              {subtopic}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TopicSidebar; 
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import SavedArticles from './components/SavedArticles';

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    // You can add any additional language-related logic here
  };

  return (
    <Router>
      <div className="app">
        <Navbar onLanguageSelect={handleLanguageSelect} />
        <Routes>
          <Route path="/" element={<Dashboard selectedLanguage={selectedLanguage} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/saved" element={<SavedArticles />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaNewspaper, FaChartBar, FaLanguage, FaBookmark } from 'react-icons/fa';
import './Navbar.css';

const Navbar = ({ onLanguageSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setIsOpen(false);
    onLanguageSelect(lang);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <FaNewspaper />
          <span>NewsAI</span>
        </Link>

        <button className="menu-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>
            <FaNewspaper />
            <span>News</span>
          </Link>
          
          <Link to="/analytics" className="nav-item" onClick={() => setIsOpen(false)}>
            <FaChartBar />
            <span>Analytics</span>
          </Link>
          
          <Link to="/saved" className="nav-item" onClick={() => setIsOpen(false)}>
            <FaBookmark />
            <span>Saved</span>
          </Link>

          <div className="language-selector">
            <label htmlFor="language">Select Language:</label>
            <select 
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="language-select"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
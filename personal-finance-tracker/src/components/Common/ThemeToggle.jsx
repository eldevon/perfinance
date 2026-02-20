import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDarkMode } = useTheme();

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <div className="theme-toggle-inner">
        <div className={`theme-icon ${isDarkMode ? 'moon' : 'sun'}`}>
          {isDarkMode ? <FiMoon /> : <FiSun />}
        </div>
        <span className="theme-label">
          {isDarkMode ? 'Dark' : 'Light'}
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;

import React, { createContext, useState, useContext, useEffect } from 'react';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/storage';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load theme from localStorage or system preference
    const savedTheme = loadFromLocalStorage('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setTheme(savedTheme);
      setIsDarkMode(savedTheme === 'dark');
    } else if (systemPrefersDark) {
      setTheme('dark');
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    saveToLocalStorage('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    setIsDarkMode(newTheme === 'dark');
  };

  const setLightTheme = () => {
    setTheme('light');
    setIsDarkMode(false);
  };

  const setDarkTheme = () => {
    setTheme('dark');
    setIsDarkMode(true);
  };

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
    setLightTheme,
    setDarkTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

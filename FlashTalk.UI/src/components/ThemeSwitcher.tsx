import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ThemeMode, FontSizeScale } from '../types/theme';
import './ThemeSwitcher.css';

export function ThemeSwitcher() {
  const { themeMode, fontSizeScale, setThemeMode, setFontSizeScale, resetTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode);
  };

  const handleFontSizeChange = (scale: FontSizeScale) => {
    setFontSizeScale(scale);
  };

  return (
    <div className="theme-switcher">
      <button 
        className="theme-switcher__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme settings"
        title="Theme Settings"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      </button>

      {isOpen && (
        <div className="theme-switcher__panel">
          <h3 className="theme-switcher__title">Appearance</h3>

          {/* Theme Mode */}
          <div className="theme-switcher__section">
            <label className="theme-switcher__label">Theme Mode</label>
            <div className="theme-switcher__buttons">
              <button
                className={`theme-switcher__button ${themeMode === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeModeChange('light')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
                Light
              </button>
              <button
                className={`theme-switcher__button ${themeMode === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeModeChange('dark')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
                Dark
              </button>
            </div>
          </div>

          {/* Font Size Scale */}
          <div className="theme-switcher__section">
            <label className="theme-switcher__label">Font Size</label>
            <div className="theme-switcher__buttons">
              <button
                className={`theme-switcher__button ${fontSizeScale === 'small' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('small')}
                title="Small text"
              >
                A
              </button>
              <button
                className={`theme-switcher__button ${fontSizeScale === 'medium' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('medium')}
                title="Medium text"
              >
                <strong>A</strong>
              </button>
              <button
                className={`theme-switcher__button ${fontSizeScale === 'large' ? 'active' : ''}`}
                onClick={() => handleFontSizeChange('large')}
                title="Large text"
              >
                <strong style={{ fontSize: '18px' }}>A</strong>
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <button 
            className="theme-switcher__reset"
            onClick={() => {
              resetTheme();
              setIsOpen(false);
            }}
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  );
}

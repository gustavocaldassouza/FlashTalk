import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ThemeContextType, UserThemePreferences, ThemeMode, FontSizeScale, Theme } from '../types/theme';
import { getTheme, getSystemTheme } from '../styles/themes';
import { updateUserThemePreferences } from '../services/ThemeService';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialPreferences?: UserThemePreferences;
  userId?: number;
  token?: string;
}

export function ThemeProvider({ children, initialPreferences, userId, token }: ThemeProviderProps) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    // Check localStorage first
    const saved = localStorage.getItem('themeMode');
    if (saved) return saved as ThemeMode;
    // Check initial preferences from server
    if (initialPreferences?.themeMode) return initialPreferences.themeMode;
    // Check system preference
    return getSystemTheme();
  });

  const [fontSizeScale, setFontSizeScaleState] = useState<FontSizeScale>(() => {
    const saved = localStorage.getItem('fontSizeScale');
    if (saved) return saved as FontSizeScale;
    if (initialPreferences?.fontSizeScale) return initialPreferences.fontSizeScale;
    return 'medium';
  });

  const [preferences, setPreferences] = useState<UserThemePreferences>(
    initialPreferences || {
      userId: userId || 0,
      themeMode,
      fontSizeScale,
    }
  );

  const [currentTheme, setCurrentTheme] = useState<Theme>(() =>
    getTheme(themeMode, fontSizeScale)
  );

  // Update theme when mode or font size changes
  useEffect(() => {
    const newTheme = getTheme(themeMode, fontSizeScale);
    setCurrentTheme(newTheme);
    
    // Apply theme to document root
    const root = document.documentElement;
    Object.entries(newTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(newTheme.fontSizes).forEach(([key, value]) => {
      root.style.setProperty(`--font-size-${key}`, value);
    });
    Object.entries(newTheme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    root.style.setProperty('--border-radius', newTheme.borderRadius);
  }, [themeMode, fontSizeScale]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
    setPreferences(prev => ({ ...prev, themeMode: mode }));
    
    // Persist to server if user is authenticated
    if (userId && token) {
      updateUserThemePreferences(userId, { themeMode: mode }, token).catch(err =>
        console.error('Failed to persist theme mode:', err)
      );
    }
  };

  const setFontSizeScale = (scale: FontSizeScale) => {
    setFontSizeScaleState(scale);
    localStorage.setItem('fontSizeScale', scale);
    setPreferences(prev => ({ ...prev, fontSizeScale: scale }));
    
    // Persist to server if user is authenticated
    if (userId && token) {
      updateUserThemePreferences(userId, { fontSizeScale: scale }, token).catch(err =>
        console.error('Failed to persist font size scale:', err)
      );
    }
  };

  const updateThemeColors = (colors: Partial<Theme['colors']>) => {
    setCurrentTheme(prev => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  };

  const resetTheme = () => {
    setThemeMode('light');
    setFontSizeScale('medium');
  };

  const value: ThemeContextType = {
    currentTheme,
    themeMode,
    fontSizeScale,
    setThemeMode,
    setFontSizeScale,
    updateThemeColors,
    resetTheme,
    preferences,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

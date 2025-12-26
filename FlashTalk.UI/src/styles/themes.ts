import { Theme, FontSizeScale } from '../types/theme';

// Font size configurations
const fontSizeConfigs = {
  small: {
    xs: '10px',
    sm: '12px',
    md: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
  },
  medium: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
  },
  large: {
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '22px',
    xxl: '28px',
  },
};

// Light Theme
export const lightTheme: Theme = {
  mode: 'light',
  colors: {
    primary: '#1976D2',
    secondary: '#DC004E',
    background: '#FFFFFF',
    surface: '#F5F5F5',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    divider: '#BDBDBD',
    hover: '#F0F0F0',
  },
  fontSizes: fontSizeConfigs.medium,
  borderRadius: '8px',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

// Dark Theme
export const darkTheme: Theme = {
  mode: 'dark',
  colors: {
    primary: '#90CAF9',
    secondary: '#F48FB1',
    background: '#121212',
    surface: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#424242',
    success: '#81C784',
    error: '#EF5350',
    warning: '#FFB74D',
    info: '#64B5F6',
    divider: '#616161',
    hover: '#2C2C2C',
  },
  fontSizes: fontSizeConfigs.medium,
  borderRadius: '8px',
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

export function getTheme(mode: 'light' | 'dark', fontSizeScale: FontSizeScale = 'medium'): Theme {
  const baseTheme = mode === 'light' ? lightTheme : darkTheme;
  return {
    ...baseTheme,
    fontSizes: fontSizeConfigs[fontSizeScale],
  };
}

// Default theme based on system preference
export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

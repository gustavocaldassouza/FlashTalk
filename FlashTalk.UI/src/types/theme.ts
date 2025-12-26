// Theme types and interfaces
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  error: string;
  warning: string;
  info: string;
  divider: string;
  hover: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
  fontSizes: FontSizes;
  borderRadius: string;
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export interface FontSizes {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  xxl: string;
}

export type FontSizeScale = 'small' | 'medium' | 'large';

export interface UserThemePreferences {
  id?: number;
  userId: number;
  themeMode: ThemeMode;
  fontSizeScale: FontSizeScale;
  customColors?: Partial<ThemeColors>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ThemeContextType {
  currentTheme: Theme;
  themeMode: ThemeMode;
  fontSizeScale: FontSizeScale;
  setThemeMode: (mode: ThemeMode) => void;
  setFontSizeScale: (scale: FontSizeScale) => void;
  updateThemeColors: (colors: Partial<ThemeColors>) => void;
  resetTheme: () => void;
  preferences: UserThemePreferences;
}

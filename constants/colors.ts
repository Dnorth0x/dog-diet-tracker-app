// Color palette for the app
export const lightColors = {
  // Base colors
  white: '#FFFFFF',
  black: '#000000',
  
  // Primary colors
  primary: '#6A8CAF', // Soft blue
  secondary: '#D4B2D8', // Soft lavender
  
  // Neutrals
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  
  // Functional colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

export const darkColors = {
  // Base colors
  white: '#000000',
  black: '#FFFFFF',
  
  // Primary colors
  primary: '#8BB4D9', // Lighter blue for dark mode
  secondary: '#E6C7EA', // Lighter lavender for dark mode
  
  // Neutrals (inverted)
  gray50: '#111827',
  gray100: '#1F2937',
  gray200: '#374151',
  gray300: '#4B5563',
  gray400: '#6B7280',
  gray500: '#9CA3AF',
  gray600: '#D1D5DB',
  gray700: '#E5E7EB',
  gray800: '#F3F4F6',
  gray900: '#F9FAFB',
  
  // Functional colors
  success: '#66BB6A',
  warning: '#FFD54F',
  error: '#EF5350',
  info: '#42A5F5',
};

// Accent color themes
export const accentThemes = {
  blue: {
    primary: '#6A8CAF',
    primaryDark: '#8BB4D9',
  },
  green: {
    primary: '#7CB342',
    primaryDark: '#9CCC65',
  },
  purple: {
    primary: '#8E24AA',
    primaryDark: '#BA68C8',
  },
  orange: {
    primary: '#FB8C00',
    primaryDark: '#FFB74D',
  },
  pink: {
    primary: '#E91E63',
    primaryDark: '#F06292',
  },
};

// Font size scales
export const fontSizes = {
  small: {
    xs: 10,
    sm: 11,
    base: 13,
    lg: 15,
    xl: 17,
    '2xl': 19,
    '3xl': 21,
    '4xl': 23,
  },
  medium: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  large: {
    xs: 14,
    sm: 16,
    base: 18,
    lg: 20,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
  },
};

// Dynamic color function
export const getColors = (theme: 'light' | 'dark', accentTheme: string = 'blue') => {
  const baseColors = theme === 'dark' ? darkColors : lightColors;
  const accent = accentThemes[accentTheme as keyof typeof accentThemes] || accentThemes.blue;
  
  return {
    ...baseColors,
    primary: theme === 'dark' ? accent.primaryDark : accent.primary,
  };
};

// Default export for backward compatibility
export const colors = lightColors;

export default colors;
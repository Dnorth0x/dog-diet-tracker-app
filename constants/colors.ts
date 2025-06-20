// Color palette for the app
export const colors = {
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
  
  // Mood colors
  mood: {
    great: '#4CAF50', // Green
    good: '#8BC34A', // Light Green
    okay: '#FFC107', // Amber
    bad: '#FF9800', // Orange
    awful: '#F44336', // Red
  },
  
  // Functional colors
  success: '#4CAF50',
  warning: '#FFC107',
  error: '#F44336',
  info: '#2196F3',
};

// Theme configuration
export const theme = {
  light: {
    text: colors.gray800,
    background: colors.white,
    card: colors.white,
    border: colors.gray200,
    notification: colors.primary,
    shadow: 'rgba(0, 0, 0, 0.05)',
    tint: colors.primary,
    tabIconDefault: colors.gray400,
    tabIconSelected: colors.primary,
  },
};

export default theme.light;